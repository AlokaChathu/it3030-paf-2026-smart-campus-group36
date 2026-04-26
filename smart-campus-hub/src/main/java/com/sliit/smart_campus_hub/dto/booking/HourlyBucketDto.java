package com.sliit.smart_campus_hub.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Single hour (0–23) booking count for charts. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HourlyBucketDto {
    private int hour;
    private long count;
}
