package com.taxibooking.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingStats {
    private long totalBookings;
    private long pendingBookings;
    private long confirmedBookings;
    private long completedTrips;
}
