package com.sliit.smart_campus_hub.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.sliit.smart_campus_hub.enums.BookingStatus;
import com.sliit.smart_campus_hub.model.Booking;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserIdOrderByStartTimeDesc(String userId);

    List<Booking> findByStatusOrderByStartTimeDesc(BookingStatus status);

    @Query("{ 'resourceId': ?0, 'status': 'APPROVED', 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 } }")
    List<Booking> findConflictingApprovedBookings(String resourceId, LocalDateTime newStart, LocalDateTime newEnd);

    @Query("{ 'status': 'APPROVED', 'startTime': { $lt: ?1 }, 'endTime': { $gt: ?0 } }")
    List<Booking> findConflictingApprovedBookingsAnyResource(LocalDateTime newStart, LocalDateTime newEnd);

    @Query("{ 'resourceId': ?0, 'status': { $in: ['PENDING', 'APPROVED'] }, 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 } }")
    List<Booking> findConflictingActiveBookings(String resourceId, LocalDateTime newStart, LocalDateTime newEnd);

    @Query("{ 'resourceId': ?0, 'status': 'APPROVED', 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 } }")
    List<Booking> findApprovedBookingsForDay(String resourceId, LocalDateTime dayStart, LocalDateTime dayEnd);
}
