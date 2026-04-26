package com.sliit.smart_campus_hub.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.sliit.smart_campus_hub.dto.booking.BookingResponse;
import com.sliit.smart_campus_hub.dto.booking.CreateBookingRequest;
import com.sliit.smart_campus_hub.dto.booking.TimeSlotResponse;
import com.sliit.smart_campus_hub.dto.booking.UpdateBookingStatusRequest;
import com.sliit.smart_campus_hub.enums.BookingStatus;
import com.sliit.smart_campus_hub.exception.BookingConflictException;
import com.sliit.smart_campus_hub.exception.ResourceNotFoundException;
import com.sliit.smart_campus_hub.exception.UnauthorizedException;
import com.sliit.smart_campus_hub.model.Booking;
import com.sliit.smart_campus_hub.model.User;
import com.sliit.smart_campus_hub.repository.BookingRepository;
import com.sliit.smart_campus_hub.service.BookingService;
import com.sliit.smart_campus_hub.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserService userService;

    @Override
    public BookingResponse createBooking(CreateBookingRequest request, String userEmail) {
        validateBookingWindow(request.getStartTime(), request.getEndTime());

        List<Booking> conflicts = bookingRepository.findConflictingApprovedBookingsAnyResource(
                request.getStartTime(),
                request.getEndTime());

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Selected time slot conflicts with an approved booking.");
        }

        User currentUser = findUserByEmail(userEmail);

        Booking booking = Booking.builder()
                .resourceId(request.getResourceId())
                .userId(currentUser.getId())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(BookingStatus.PENDING)
                .purpose(request.getPurpose().trim())
                .attendees(request.getAttendees())
                .rejectionReason(null)
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(bookingRepository.save(booking));
    }

    @Override
    public List<BookingResponse> getMyBookings(String userEmail) {
        User currentUser = findUserByEmail(userEmail);
        return bookingRepository.findByUserIdOrderByStartTimeDesc(currentUser.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<BookingResponse> getAllBookings(Long resourceId, LocalDate date, BookingStatus status) {
        return bookingRepository.findAll()
                .stream()
                .filter(booking -> resourceId == null || resourceId.equals(booking.getResourceId()))
                .filter(booking -> status == null || status == booking.getStatus())
                .filter(booking -> {
                    if (date == null) {
                        return true;
                    }
                    LocalDateTime dayStart = date.atStartOfDay();
                    LocalDateTime dayEnd = date.atTime(LocalTime.MAX);
                    return booking.getStartTime().isBefore(dayEnd) && booking.getEndTime().isAfter(dayStart);
                })
                .sorted(Comparator.comparing(Booking::getStartTime).reversed())
                .map(this::toResponse)
                .toList();
    }

    @Override
    public BookingResponse updateBookingStatus(String bookingId, UpdateBookingStatusRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        BookingStatus newStatus = request.getStatus();
        if (newStatus != BookingStatus.APPROVED && newStatus != BookingStatus.REJECTED) {
            throw new IllegalArgumentException("Only APPROVED or REJECTED status is allowed for this endpoint.");
        }

        if (newStatus == BookingStatus.APPROVED) {
            List<Booking> conflicts = bookingRepository.findConflictingApprovedBookingsAnyResource(
                    booking.getStartTime(),
                    booking.getEndTime());

            boolean hasOtherConflict = conflicts.stream()
                    .anyMatch(existing -> !existing.getId().equals(booking.getId()));

            if (hasOtherConflict) {
                throw new BookingConflictException("Cannot approve booking due to a conflict with another approved booking.");
            }

            booking.setRejectionReason(null);
        }

        if (newStatus == BookingStatus.REJECTED) {
            String reason = request.getRejectionReason() == null ? "" : request.getRejectionReason().trim();
            if (reason.isBlank()) {
                throw new IllegalArgumentException("rejectionReason is required when status is REJECTED.");
            }
            booking.setRejectionReason(reason);
        }

        booking.setStatus(newStatus);
        return toResponse(bookingRepository.save(booking));
    }

    @Override
    public void cancelBooking(String bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        User currentUser = findUserByEmail(userEmail);
        boolean isAdmin = currentUser.getRole() != null && "ADMIN".equals(currentUser.getRole().name());
        boolean isOwner = booking.getUserId().equals(currentUser.getId());

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not allowed to cancel this booking.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    @Override
    public List<TimeSlotResponse> getUnavailableSlots(Long resourceId, LocalDate date) {
        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = date.atTime(LocalTime.MAX);

        return bookingRepository.findApprovedBookingsForDay(resourceId, dayStart, dayEnd)
                .stream()
                .sorted(Comparator.comparing(Booking::getStartTime))
                .map(booking -> new TimeSlotResponse(booking.getStartTime(), booking.getEndTime()))
                .toList();
    }

    private void validateBookingWindow(LocalDateTime startTime, LocalDateTime endTime) {
        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException("startTime must be before endTime.");
        }

        if (startTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Past bookings are not allowed.");
        }
    }

    private User findUserByEmail(String userEmail) {
        return userService.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + userEmail));
    }

    private BookingResponse toResponse(Booking booking) {
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
