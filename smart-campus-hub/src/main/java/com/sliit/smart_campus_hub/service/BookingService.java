package com.sliit.smart_campus_hub.service;

import java.time.LocalDate;
import java.util.List;

import com.sliit.smart_campus_hub.dto.booking.BookingResponse;
import com.sliit.smart_campus_hub.dto.booking.CreateBookingRequest;
import com.sliit.smart_campus_hub.dto.booking.TimeSlotResponse;
import com.sliit.smart_campus_hub.dto.booking.UpdateBookingStatusRequest;
import com.sliit.smart_campus_hub.enums.BookingStatus;

public interface BookingService {
    BookingResponse createBooking(CreateBookingRequest request, String userEmail);
    List<BookingResponse> getMyBookings(String userEmail);
    List<BookingResponse> getAllBookings(Long resourceId, LocalDate date, BookingStatus status);
    BookingResponse updateBookingStatus(String bookingId, UpdateBookingStatusRequest request);
    void cancelBooking(String bookingId, String userEmail);
    List<TimeSlotResponse> getUnavailableSlots(Long resourceId, LocalDate date);
}
