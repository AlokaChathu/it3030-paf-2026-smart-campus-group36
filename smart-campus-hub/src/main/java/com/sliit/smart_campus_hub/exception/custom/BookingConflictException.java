package com.sliit.smart_campus_hub.exception.custom;

public class BookingConflictException extends RuntimeException {
    public BookingConflictException(String message) {
        super(message);
    }
}
