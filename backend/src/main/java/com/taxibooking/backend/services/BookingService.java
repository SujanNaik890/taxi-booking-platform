package com.taxibooking.backend.services;

import com.taxibooking.backend.dto.BookingStats;
import com.taxibooking.backend.models.Booking;
import com.taxibooking.backend.repositories.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        booking.setStatus("PENDING");
        booking.setPaymentStatus("PENDING");
        booking.setCreatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookings(String status, String search) {
        boolean hasStatus = status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL");
        boolean hasSearch = search != null && !search.trim().isEmpty();

        if (hasStatus && hasSearch) {
            return bookingRepository.searchBookingsWithStatus(status.toUpperCase(), search);
        } else if (hasStatus) {
            return bookingRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
        } else if (hasSearch) {
            return bookingRepository.searchBookings(search);
        } else {
            return bookingRepository.findAllByOrderByCreatedAtDesc();
        }
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));
    }

    public Booking updateBooking(String id, Booking details) {
        Booking booking = getBookingById(id);
        booking.setCustomerName(details.getCustomerName());
        booking.setPhone(details.getPhone());
        booking.setPickup(details.getPickup());
        booking.setDrop(details.getDrop());
        booking.setDate(details.getDate());
        booking.setTime(details.getTime());
        booking.setPassengers(details.getPassengers());
        booking.setTripType(details.getTripType());
        booking.setNotes(details.getNotes());
        booking.setDistance(details.getDistance());
        booking.setEstimatedPrice(details.getEstimatedPrice());
        
        if (details.getStatus() != null) {
            booking.setStatus(details.getStatus().toUpperCase());
        }
        if (details.getQuotedPrice() != null) {
            booking.setQuotedPrice(details.getQuotedPrice());
        }
        if (details.getPaymentStatus() != null) {
            booking.setPaymentStatus(details.getPaymentStatus().toUpperCase());
        }
        return bookingRepository.save(booking);
    }

    public Booking updateStatus(String id, String status, Double quotedPrice) {
        Booking booking = getBookingById(id);
        if (status != null) {
            booking.setStatus(status.toUpperCase());
        }
        if (quotedPrice != null) {
            booking.setQuotedPrice(quotedPrice);
        }
        return bookingRepository.save(booking);
    }

    public Booking save(Booking booking) {
        return bookingRepository.save(booking);
    }

    public void deleteBooking(String id) {
        Booking booking = getBookingById(id);
        bookingRepository.delete(booking);
    }

    public BookingStats getStats() {
        long total = bookingRepository.count();
        long pending = bookingRepository.countByStatus("PENDING");
        long confirmed = bookingRepository.countByStatus("CONFIRMED");
        long completed = bookingRepository.countByStatus("COMPLETED");
        return new BookingStats(total, pending, confirmed, completed);
    }
}
