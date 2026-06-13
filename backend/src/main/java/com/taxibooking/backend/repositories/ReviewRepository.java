package com.taxibooking.backend.repositories;

import com.taxibooking.backend.models.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByApprovedOrderByCreatedAtDesc(Boolean approved);
    List<Review> findAllByOrderByCreatedAtDesc();
}
