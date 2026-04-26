package com.sliit.smart_campus_hub.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Bookings by ISO day-of-week: 1 = Monday … 7 = Sunday. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DayBusynessDto {
    private int isoDayOfWeek;
    private String dayLabel;
    private long count;
}
