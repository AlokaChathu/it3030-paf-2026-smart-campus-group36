package com.sliit.smart_campus_hub.service.impl;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import com.sliit.smart_campus_hub.dto.booking.DayBusynessDto;
import com.sliit.smart_campus_hub.dto.booking.HourlyBucketDto;
import com.sliit.smart_campus_hub.dto.booking.PeakHoursAnalyticsResponse;
import com.sliit.smart_campus_hub.enums.BookingStatus;
import com.sliit.smart_campus_hub.model.Booking;
import com.sliit.smart_campus_hub.repository.BookingRepository;
import com.sliit.smart_campus_hub.service.BookingAnalyticsService;

import lombok.RequiredArgsConstructor;

/**
 * Server-side aggregations on APPROVED bookings (one round-trip with $facet).
 */
@Service
@RequiredArgsConstructor
public class BookingAnalyticsServiceImpl implements BookingAnalyticsService {

    private static final int CAMPUS_HOUR_MIN = 7;
    private static final int CAMPUS_HOUR_MAX = 20;
    private static final int BEST_WINDOW_START = 8;
    private static final int BEST_WINDOW_END_START = 16;

    private static final String[] ISO_DOW = { "", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
            "Sunday" };

    private final MongoTemplate mongoTemplate;
    private final BookingRepository bookingRepository;

    @Override
    public PeakHoursAnalyticsResponse getPeakHoursAnalytics(Integer days) {
        Integer windowDays = (days == null || days <= 0) ? null : Math.min(days, 730);

        long preCount = windowDays == null
                ? bookingRepository.countByStatus(BookingStatus.APPROVED)
                : bookingRepository.countByStatusAndStartTimeGreaterThanEqual(
                        BookingStatus.APPROVED, LocalDateTime.now().minusDays(windowDays));
        if (preCount == 0) {
            return emptyResponse(windowDays);
        }

        Criteria criteria = Criteria.where("status").is(BookingStatus.APPROVED);
        if (windowDays != null) {
            criteria = criteria.and("startTime").gte(LocalDateTime.now().minusDays(windowDays));
        }
        MatchOperation match = Aggregation.match(criteria);

        AggregationOperation addTimeParts = context -> {
            Document hourExpr = new Document("$hour", "$startTime");
            Document dowExpr = new Document("$isoDayOfWeek", "$startTime");
            return new Document("$addFields", new Document("hour", hourExpr).append("dow", dowExpr));
        };

        @SuppressWarnings("unchecked")
        List<Document> facetHourly = List.of(
                new Document("$group", new Document("_id", "$hour")
                        .append("count", new Document("$sum", 1))),
                new Document("$sort", new Document("_id", 1)));

        @SuppressWarnings("unchecked")
        List<Document> facetDaily = List.of(
                new Document("$group", new Document("_id", "$dow")
                        .append("count", new Document("$sum", 1))),
                new Document("$sort", new Document("_id", 1)));

        @SuppressWarnings("unchecked")
        List<Document> facetTotal = List.of(
                new Document("$count", "n"));

        AggregationOperation facet = context -> {
            Map<String, List<Document>> f = new HashMap<>();
            f.put("hourly", (List<Document>) (List<?>) facetHourly);
            f.put("daily", (List<Document>) (List<?>) facetDaily);
            f.put("total", (List<Document>) (List<?>) facetTotal);
            return new Document("$facet", new Document(f));
        };

        Aggregation agg = Aggregation.newAggregation(match, addTimeParts, facet);
        AggregationResults<Document> res = mongoTemplate.aggregate(agg, Booking.class, Document.class);
        List<Document> docs = res.getMappedResults();
        if (docs.isEmpty()) {
            return emptyResponse(windowDays);
        }
        Document root = docs.get(0);
        @SuppressWarnings("unchecked")
        List<Document> hourlyDocs = (List<Document>) root.get("hourly");
        @SuppressWarnings("unchecked")
        List<Document> dailyDocs = (List<Document>) root.get("daily");
        @SuppressWarnings("unchecked")
        List<Document> totalDocs = (List<Document>) root.get("total");

        long total = 0L;
        if (totalDocs != null && !totalDocs.isEmpty() && totalDocs.get(0).get("n") != null) {
            total = toLong(totalDocs.get(0).get("n"));
        }

        if (total == 0) {
            return emptyResponse(windowDays);
        }

        Map<Integer, Long> byHour = new HashMap<>();
        if (hourlyDocs != null) {
            for (Document d : hourlyDocs) {
                Object id = d.get("_id");
                if (id instanceof Number) {
                    byHour.put(((Number) id).intValue(), toLong(d.get("count")));
                }
            }
        }

        List<HourlyBucketDto> hourSeries = IntStream.range(0, 24)
                .mapToObj(h -> HourlyBucketDto.builder()
                        .hour(h)
                        .count(byHour.getOrDefault(h, 0L))
                        .build())
                .collect(Collectors.toList());

        Map<Integer, Long> byDow = new HashMap<>();
        if (dailyDocs != null) {
            for (Document d : dailyDocs) {
                Object id = d.get("_id");
                if (id instanceof Number) {
                    byDow.put(((Number) id).intValue(), toLong(d.get("count")));
                }
            }
        }

        List<DayBusynessDto> daySeries = IntStream.rangeClosed(1, 7)
                .mapToObj(d -> DayBusynessDto.builder()
                        .isoDayOfWeek(d)
                        .dayLabel(ISO_DOW[d])
                        .count(byDow.getOrDefault(d, 0L))
                        .build())
                .collect(Collectors.toList());

        List<HourlyBucketDto> withBookings = hourSeries.stream()
                .filter(b -> b.getCount() > 0)
                .sorted(Comparator.comparingLong(HourlyBucketDto::getCount).reversed())
                .collect(Collectors.toList());

        List<String> peak = withBookings.stream()
                .limit(3)
                .map(b -> formatHourLabel(b.getHour()))
                .collect(Collectors.toList());
        if (peak.isEmpty()) {
            peak = List.of("—");
        }

        List<HourlyBucketDto> inCampus = hourSeries.stream()
                .filter(b -> b.getHour() >= CAMPUS_HOUR_MIN && b.getHour() <= CAMPUS_HOUR_MAX)
                .sorted(Comparator.comparingLong(HourlyBucketDto::getCount))
                .toList();
        List<String> low = inCampus.stream()
                .limit(3)
                .map(b -> formatHourLabel(b.getHour()))
                .collect(Collectors.toList());
        if (low.isEmpty()) {
            low = List.of("—");
        }

        String mostBusy = daySeries.stream()
                .max(Comparator.comparingLong(DayBusynessDto::getCount))
                .map(DayBusynessDto::getDayLabel)
                .orElse("—");

        String bestWindow = computeBestWindow(hourSeries);

        String note = buildNote(windowDays, total);

        String peakHour24 = withBookings.isEmpty() ? "—" : formatPeakOneHour24(withBookings.get(0).getHour());

        return PeakHoursAnalyticsResponse.builder()
                .peakHour(peakHour24)
                .totalApprovedBookings(total)
                .analysisWindowDays(windowDays)
                .analysisNote(note)
                .hourOfDaySeries(hourSeries)
                .dayOfWeekSeries(daySeries)
                .peakHours(peak)
                .lowTrafficHours(low)
                .mostBusyDay(mostBusy)
                .bestRecommendedTime(bestWindow)
                .build();
    }

    private static PeakHoursAnalyticsResponse emptyResponse(Integer windowDays) {
        String note = (windowDays == null)
                ? "No approved bookings found yet. Insights will appear as bookings are approved."
                : "No approved bookings in the last " + windowDays
                        + " days. Try a wider time range or wait for more activity.";
        List<HourlyBucketDto> zeros = IntStream.range(0, 24)
                .mapToObj(h -> HourlyBucketDto.builder().hour(h).count(0L).build())
                .collect(Collectors.toList());
        List<DayBusynessDto> days = IntStream.rangeClosed(1, 7)
                .mapToObj(d -> DayBusynessDto.builder()
                        .isoDayOfWeek(d)
                        .dayLabel(ISO_DOW[d])
                        .count(0L)
                        .build())
                .collect(Collectors.toList());
        return PeakHoursAnalyticsResponse.builder()
                .peakHour("—")
                .totalApprovedBookings(0)
                .analysisWindowDays(windowDays)
                .analysisNote(note)
                .hourOfDaySeries(zeros)
                .dayOfWeekSeries(days)
                .peakHours(List.of("—"))
                .lowTrafficHours(List.of("—"))
                .mostBusyDay("—")
                .bestRecommendedTime("—")
                .build();
    }

    /** Single hour block in 24h format, e.g. 10:00 - 11:00 */
    private static String formatPeakOneHour24(int hour) {
        int end = (hour + 1) % 24;
        return String.format(Locale.US, "%02d:00 - %02d:00", hour, end);
    }

    private static long toLong(Object o) {
        if (o instanceof Number) {
            return ((Number) o).longValue();
        }
        return 0L;
    }

    private static String formatHourLabel(int hour) {
        int h = hour % 12 == 0 ? 12 : hour % 12;
        String ap = hour < 12 ? "AM" : "PM";
        return String.format(Locale.US, "%d:00 %s", h, ap);
    }

    /**
     * Contiguous 2-hour window in [8,16] start hour with the lowest combined booking count.
     */
    private static String computeBestWindow(List<HourlyBucketDto> series) {
        Map<Integer, Long> m = new HashMap<>();
        for (HourlyBucketDto b : series) {
            m.put(b.getHour(), b.getCount());
        }
        int bestStart = BEST_WINDOW_START;
        long bestScore = Long.MAX_VALUE;
        for (int s = BEST_WINDOW_START; s <= BEST_WINDOW_END_START; s++) {
            long sum = m.getOrDefault(s, 0L) + m.getOrDefault(s + 1, 0L);
            if (sum < bestScore) {
                bestScore = sum;
                bestStart = s;
            }
        }
        if (bestScore == Long.MAX_VALUE) {
            return "—";
        }
        return formatHourLabel(bestStart) + " – " + formatHourLabel(bestStart + 1);
    }

    private static String buildNote(Integer windowDays, long total) {
        if (windowDays == null) {
            return String.format(
                    Locale.US,
                    "Based on %,d approved booking(s) across the full history. Off-peak times can reduce conflicts and improve resource use.",
                    total);
        }
        return String.format(
                Locale.US,
                "Based on %,d approved booking(s) in the last %d day(s). Prefer recommended windows to avoid the busiest times.",
                total,
                windowDays);
    }
}
