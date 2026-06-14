package com.taxibooking.backend.repositories;

import com.taxibooking.backend.models.Destination;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface DestinationRepository extends MongoRepository<Destination, String> {
    Optional<Destination> findByName(String name);
}
