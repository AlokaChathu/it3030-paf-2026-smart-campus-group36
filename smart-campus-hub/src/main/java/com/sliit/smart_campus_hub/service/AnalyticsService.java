package com.sliit.smart_campus_hub.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sliit.smart_campus_hub.dto.TechnicianRatingResponse;
import com.sliit.smart_campus_hub.dto.TicketTrendResponse;
import com.sliit.smart_campus_hub.model.Ticket;
import com.sliit.smart_campus_hub.repository.TicketRepository;
import com.sliit.smart_campus_hub.repository.UserRepository;

@Service
public class AnalyticsService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TicketTrendResponse> getTicketTrends(String timeRange) {
        Date startDate = getStartDate(timeRange);
        
        List<Ticket> tickets = ticketRepository.findByCreatedAtAfterOrderByCreatedAtAsc(startDate);
        
        // Group by date
        Map<String, Long> dateCountMap = tickets.stream()
            .collect(Collectors.groupingBy(
                ticket -> {
                    LocalDate localDate = ticket.getCreatedAt().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate();
                    return localDate.toString();
                },
                Collectors.counting()
            ));

        // Convert to response list
        List<TicketTrendResponse> response = new ArrayList<>();
        for (Map.Entry<String, Long> entry : dateCountMap.entrySet()) {
            response.add(new TicketTrendResponse(entry.getKey(), entry.getValue()));
        }

        return response.stream()
            .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
            .collect(Collectors.toList());
    }

    public List<TechnicianRatingResponse> getTechnicianRatings(String timeRange) {
        Date startDate = getStartDate(timeRange);
        
        // Get all rated tickets assigned to technicians
        List<Ticket> ratedTickets = ticketRepository.findByRatingNotNullAndCreatedAtAfter(startDate);
        
        // Group by technician
        Map<String, List<Ticket>> ticketsByTechnician = ratedTickets.stream()
            .filter(ticket -> ticket.getAssignedTo() != null)
            .collect(Collectors.groupingBy(Ticket::getAssignedTo));

        // Fetch all technician users at once
        List<String> technicianIds = new ArrayList<>(ticketsByTechnician.keySet());
        Map<String, String> technicianNameMap = new HashMap<>();
        for (String techId : technicianIds) {
            userRepository.findById(techId).ifPresent(user -> {
                technicianNameMap.put(techId, user.getFullName());
            });
        }

        List<TechnicianRatingResponse> response = new ArrayList<>();
        
        for (Map.Entry<String, List<Ticket>> entry : ticketsByTechnician.entrySet()) {
            String technicianId = entry.getKey();
            List<Ticket> technicianTickets = entry.getValue();
            
            double averageRating = technicianTickets.stream()
                .mapToInt(Ticket::getRating)
                .average()
                .orElse(0.0);
            
            long totalRatings = technicianTickets.size();
            
            // Get technician name from the pre-fetched map
            String technicianName = technicianNameMap.getOrDefault(technicianId, "Unknown Technician");
            
            response.add(new TechnicianRatingResponse(
                technicianId,
                technicianName,
                averageRating,
                totalRatings
            ));
        }

        // Sort by average rating descending
        return response.stream()
            .sorted((a, b) -> Double.compare(b.getAverageRating(), a.getAverageRating()))
            .collect(Collectors.toList());
    }

    private Date getStartDate(String timeRange) {
        LocalDate now = LocalDate.now();
        LocalDate startDate;
        
        switch (timeRange) {
            case "7days":
                startDate = now.minusDays(7);
                break;
            case "30days":
                startDate = now.minusDays(30);
                break;
            case "all":
            default:
                startDate = LocalDate.of(2020, 1, 1); // Far back date for "all time"
                break;
        }
        
        return Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }
}
