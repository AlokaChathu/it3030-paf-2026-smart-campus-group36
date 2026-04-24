package com.sliit.smart_campus_hub.controller;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sliit.smart_campus_hub.dto.ApiResponse;
import com.sliit.smart_campus_hub.dto.booking.BookingResponse;
import com.sliit.smart_campus_hub.dto.booking.CreateBookingRequest;
import com.sliit.smart_campus_hub.dto.booking.UpdateBookingStatusRequest;
import com.sliit.smart_campus_hub.enums.BookingStatus;
import com.sliit.smart_campus_hub.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','TECHNICIAN','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse> createBooking(@Valid @RequestBody CreateBookingRequest request, Principal principal) {
        BookingResponse response = bookingService.createBooking(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Booking request created", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER','TECHNICIAN','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse> getMyBookings(Principal principal) {
        List<BookingResponse> response = bookingService.getMyBookings(principal.getName());
        return ResponseEntity.ok(new ApiResponse(true, "Bookings retrieved", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllBookings(
            @RequestParam(required = false) Long resourceId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) BookingStatus status) {
        List<BookingResponse> response = bookingService.getAllBookings(resourceId, date, status);
        return ResponseEntity.ok(new ApiResponse(true, "Bookings retrieved", response));
    }

    @GetMapping("/availability")
    @PreAuthorize("hasAnyRole('USER','TECHNICIAN','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse> getApprovedSlots(
            @RequestParam Long resourceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<BookingResponse> response = bookingService.getApprovedSlots(resourceId, date);
        return ResponseEntity.ok(new ApiResponse(true, "Approved slots retrieved", response));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBookingStatusRequest request) {
        BookingResponse response = bookingService.updateBookingStatus(id, request);
        return ResponseEntity.ok(new ApiResponse(true, "Booking status updated", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','TECHNICIAN','MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse> cancelBooking(@PathVariable Long id, Principal principal, Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> "ROLE_ADMIN".equals(auth.getAuthority()));
        bookingService.cancelBooking(id, principal.getName(), isAdmin);
        return ResponseEntity.ok(new ApiResponse(true, "Booking cancelled"));
    }
}
