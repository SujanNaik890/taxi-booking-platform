package com.taxibooking.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    
    private String customerName;
    private String phone;
    private String pickup;
    private String drop;
    private String date; // YYYY-MM-DD
    private String time; // HH:mm
    private Integer passengers;
    private String tripType; // One Way / Round Trip
    private String notes;
    
    private String status = "PENDING"; // PENDING, QUOTED, CONFIRMED, COMPLETED, CANCELLED
    private Double quotedPrice; // Manual quote by driver
    
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String paymentStatus = "PENDING"; // PENDING, PAID, FAILED
    
    private Double distance;
    private Double estimatedPrice;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
