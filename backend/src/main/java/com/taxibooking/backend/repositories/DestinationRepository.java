package com.taxibooking.backend.repositories;

import com.taxibooking.backend.models.Destination;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DestinationRepository extends MongoRepository<Destination, String> {
}
