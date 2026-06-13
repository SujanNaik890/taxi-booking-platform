package com.taxibooking.backend.repositories;

import com.taxibooking.backend.models.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findAllByOrderByCreatedAtDesc();
    List<Booking> findByStatusOrderByCreatedAtDesc(String status);
    
    @Query("{ '$or': [ { 'customerName': { '$regex': ?0, '$options': 'i' } }, { 'phone': { '$regex': ?0, '$options': 'i' } } ] }")
    List<Booking> searchBookings(String query);
    
    @Query("{ 'status': ?0, '$or': [ { 'customerName': { '$regex': ?1, '$options': 'i' } }, { 'phone': { '$regex': ?1, '$options': 'i' } } ] }")
    List<Booking> searchBookingsWithStatus(String status, String query);

    long countByStatus(String status);
}
