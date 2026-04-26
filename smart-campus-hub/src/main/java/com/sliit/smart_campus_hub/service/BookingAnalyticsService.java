package com.sliit.smart_campus_hub.service;

import com.sliit.smart_campus_hub.dto.booking.PeakHoursAnalyticsResponse;

public interface BookingAnalyticsService {

    /**
     * Aggregates {@code APPROVED} booking start times (DB-side). Optional {@code days} limits how far back
     * to look; null or non-positive = all time.
     */
    PeakHoursAnalyticsResponse getPeakHoursAnalytics(Integer days);
}
