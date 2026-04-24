package com.sliit.smart_campus_hub.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.sliit.smart_campus_hub.dto.booking.BookingResponse;
import com.sliit.smart_campus_hub.dto.booking.CreateBookingRequest;
import com.sliit.smart_campus_hub.dto.booking.UpdateBookingStatusRequest;
import com.sliit.smart_campus_hub.enums.BookingStatus;
import com.sliit.smart_campus_hub.exception.custom.BookingConflictException;
import com.sliit.smart_campus_hub.exception.custom.ResourceNotFoundException;
import com.sliit.smart_campus_hub.exception.custom.UnauthorizedException;
import com.sliit.smart_campus_hub.model.Booking;
import com.sliit.smart_campus_hub.model.User;
import com.sliit.smart_campus_hub.repository.BookingRepository;
import com.sliit.smart_campus_hub.repository.UserRepository;
import com.sliit.smart_campus_hub.service.BookingService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Override
    public BookingResponse createBooking(CreateBookingRequest request, String userEmail) {
        validateBookingTimeRange(request.getStartTime(), request.getEndTime());

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        List<Booking> conflicts = bookingRepository.findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
                request.getResourceId(),
                BookingStatus.APPROVED,
                request.getEndTime(),
                request.getStartTime());

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Selected time slot is unavailable for this resource");
        }

        Booking booking = Booking.builder()
                .resourceId(request.getResourceId())
                .userId(user.getId())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(BookingStatus.PENDING)
                .purpose(request.getPurpose().trim())
                .attendees(request.getAttendees())
                .rejectionReason(null)
                .build();

        return mapToResponse(bookingRepository.save(booking));
    }

    @Override
    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<BookingResponse> getAllBookings(Long resourceId, LocalDate date, BookingStatus status) {
        Specification<Booking> specification = Specification.where(null);

        if (resourceId != null) {
            specification = specification.and((root, query, cb) -> cb.equal(root.get("resourceId"), resourceId));
        }

        if (status != null) {
            specification = specification.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        if (date != null) {
            LocalDateTime from = date.atStartOfDay();
            LocalDateTime to = date.plusDays(1).atStartOfDay();
            specification = specification.and(
                    (root, query, cb) -> cb.and(
                            cb.greaterThanOrEqualTo(root.get("startTime"), from),
                            cb.lessThan(root.get("startTime"), to)));
        }

        return bookingRepository.findAll(specification)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<BookingResponse> getApprovedSlots(Long resourceId, LocalDate date) {
        Specification<Booking> specification = Specification.where(
                (root, query, cb) -> cb.equal(root.get("status"), BookingStatus.APPROVED));

        specification = specification.and((root, query, cb) -> cb.equal(root.get("resourceId"), resourceId));

        if (date != null) {
            LocalDateTime from = date.atStartOfDay();
            LocalDateTime to = date.plusDays(1).atStartOfDay();
            specification = specification.and(
                    (root, query, cb) -> cb.and(
                            cb.greaterThanOrEqualTo(root.get("startTime"), from),
                            cb.lessThan(root.get("startTime"), to)));
        }

        return bookingRepository.findAll(specification)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public BookingResponse updateBookingStatus(Long bookingId, UpdateBookingStatusRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (request.getStatus() != BookingStatus.APPROVED && request.getStatus() != BookingStatus.REJECTED) {
            throw new IllegalArgumentException("Status update only supports APPROVED or REJECTED");
        }

        if (request.getStatus() == BookingStatus.APPROVED) {
            List<Booking> conflicts = bookingRepository.findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
                    booking.getResourceId(),
                    BookingStatus.APPROVED,
                    booking.getEndTime(),
                    booking.getStartTime());

            boolean hasConflict = conflicts.stream().anyMatch(existing -> !existing.getId().equals(bookingId));
            if (hasConflict) {
                throw new BookingConflictException("Booking overlaps with another approved booking");
            }
            booking.setRejectionReason(null);
        }

        if (request.getStatus() == BookingStatus.REJECTED) {
            if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
                throw new IllegalArgumentException("Rejection reason is required when rejecting a booking");
            }
            booking.setRejectionReason(request.getRejectionReason().trim());
        }

        booking.setStatus(request.getStatus());
        return mapToResponse(bookingRepository.save(booking));
    }

    @Override
    public void cancelBooking(Long bookingId, String userEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!isAdmin) {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

            if (!booking.getUserId().equals(user.getId())) {
                throw new UnauthorizedException("You are not allowed to cancel this booking");
            }
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private void validateBookingTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
        if (startTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Past bookings are not allowed");
        }
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .resourceId(booking.getResourceId())
                .userId(booking.getUserId())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus())
                .purpose(booking.getPurpose())
                .attendees(booking.getAttendees())
                .rejectionReason(booking.getRejectionReason())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
