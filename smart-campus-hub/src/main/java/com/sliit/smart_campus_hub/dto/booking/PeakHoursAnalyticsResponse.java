package com.sliit.smart_campus_hub.dto.booking;

import java.util.List;

import lombok.Builder;
import lombok.Data;

/**
 * Peak hours analytics for APPROVED campus bookings (trends & recommendations).
 */
@Data
@Builder
public class PeakHoursAnalyticsResponse {

    /**
     * Single busiest 1-hour window (24h), e.g. "10:00 - 11:00", derived from
     * the hour with the most approved booking starts.
     */
    private String peakHour;

    private long totalApprovedBookings;
    private Integer analysisWindowDays;
    private String analysisNote;

    private List<HourlyBucketDto> hourOfDaySeries;
    private List<DayBusynessDto> dayOfWeekSeries;

    private List<String> peakHours;
    private List<String> lowTrafficHours;
    private String mostBusyDay;
    private String bestRecommendedTime;
}
