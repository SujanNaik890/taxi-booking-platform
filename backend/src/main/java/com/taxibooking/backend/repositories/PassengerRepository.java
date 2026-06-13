package com.taxibooking.backend.repositories;

import com.taxibooking.backend.models.Passenger;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PassengerRepository extends MongoRepository<Passenger, String> {
    Optional<Passenger> findByEmail(String email);
    Optional<Passenger> findByPhone(String phone);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}
