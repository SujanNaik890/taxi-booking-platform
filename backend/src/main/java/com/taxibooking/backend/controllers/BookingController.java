package com.taxibooking.backend.controllers;

import com.taxibooking.backend.dto.BookingStats;
import com.taxibooking.backend.dto.PaymentVerifyRequest;
import com.taxibooking.backend.models.Booking;
import com.taxibooking.backend.services.BookingService;
import com.taxibooking.backend.services.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PaymentService paymentService;

    // Public: Create a new booking request
    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody Booking booking) {
        Booking savedBooking = bookingService.createBooking(booking);
        return ResponseEntity.ok(savedBooking);
    }

    // Admin: Get all bookings with filtering and search
    @GetMapping
    public ResponseEntity<List<Booking>> getBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        List<Booking> bookings = bookingService.getBookings(status, search);
        return ResponseEntity.ok(bookings);
    }

    // Admin: Get booking stats
    @GetMapping("/stats")
    public ResponseEntity<BookingStats> getStats() {
        BookingStats stats = bookingService.getStats();
        return ResponseEntity.ok(stats);
    }

    // Public: Get booking details (used by customers to view quotes & pay)
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        try {
            Booking booking = bookingService.getBookingById(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Admin: Update booking details, status, or quotation price
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable String id, @RequestBody Booking bookingDetails) {
        try {
            Booking updatedBooking = bookingService.updateBooking(id, bookingDetails);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin: Delete a booking
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable String id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok().body("Booking deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Public: Create a Razorpay Order for a Quoted Booking
    @PostMapping("/{id}/payment/order")
    public ResponseEntity<?> createPaymentOrder(@PathVariable String id) {
        try {
            Booking booking = bookingService.getBookingById(id);
            
            if (!"QUOTED".equalsIgnoreCase(booking.getStatus())) {
                return ResponseEntity.badRequest().body("Booking must be QUOTED to initiate payment");
            }
            if (booking.getQuotedPrice() == null || booking.getQuotedPrice() <= 0) {
                return ResponseEntity.badRequest().body("Quoted price is invalid or not yet decided");
            }

            // Generate Razorpay Order
            String razorpayOrderId = paymentService.createOrder(booking.getId(), booking.getQuotedPrice());
            booking.setRazorpayOrderId(razorpayOrderId);
            bookingService.save(booking);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", razorpayOrderId);
            response.put("amount", booking.getQuotedPrice());
            response.put("currency", "INR");
            response.put("bookingId", booking.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to create payment order: " + e.getMessage());
        }
    }

    // Public: Verify Razorpay Payment Signature
    @PostMapping("/{id}/payment/verify")
    public ResponseEntity<?> verifyPayment(@PathVariable String id, @Valid @RequestBody PaymentVerifyRequest request) {
        try {
            Booking booking = bookingService.getBookingById(id);

            boolean isValid = paymentService.verifySignature(
                    request.getRazorpayOrderId(),
                    request.getRazorpayPaymentId(),
                    request.getRazorpaySignature()
            );

            if (isValid) {
                booking.setRazorpayPaymentId(request.getRazorpayPaymentId());
                booking.setPaymentStatus("PAID");
                booking.setStatus("CONFIRMED"); // Mark booking as confirmed
                bookingService.save(booking);

                return ResponseEntity.ok(booking);
            } else {
                booking.setPaymentStatus("FAILED");
                bookingService.save(booking);
                return ResponseEntity.badRequest().body("Payment signature verification failed");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to verify payment: " + e.getMessage());
        }
    }
}
