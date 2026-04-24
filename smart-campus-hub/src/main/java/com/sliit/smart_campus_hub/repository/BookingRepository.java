package com.sliit.smart_campus_hub.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.sliit.smart_campus_hub.enums.BookingStatus;
import com.sliit.smart_campus_hub.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Booking> findByResourceIdAndStatusAndStartTimeLessThanAndEndTimeGreaterThan(
            Long resourceId,
            BookingStatus status,
            LocalDateTime endTime,
            LocalDateTime startTime);
}
