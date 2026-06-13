package com.taxibooking.backend.services;

import com.taxibooking.backend.models.Review;
import com.taxibooking.backend.repositories.ReviewRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @PostConstruct
    public void seedReviews() {
        if (reviewRepository.count() == 0) {
            List<Review> defaults = new ArrayList<>();
            defaults.add(new Review(null, "Rajesh Kumar", 5, 
                "Excellent service! The airport pick-up was perfectly on time. The vehicle was clean and well-maintained. Highly recommended!", 
                true, LocalDateTime.now()));
            defaults.add(new Review(null, "Sneha Hegde", 5, 
                "We booked a round trip to Coorg. The driver was highly professional, knew all the scenic spots, and drove very safely. Very reasonable price!", 
                true, LocalDateTime.now().minusDays(2)));
            defaults.add(new Review(null, "Anil Mathews", 4, 
                "Had a great corporate outstation trip to Mysuru. The driver is very courteous and professional. Highly reliable.", 
                true, LocalDateTime.now().minusDays(5)));
            
            reviewRepository.saveAll(defaults);
            System.out.println("Default reviews seeded successfully!");
        }
    }

    public List<Review> getApprovedReviews() {
        return reviewRepository.findByApprovedOrderByCreatedAtDesc(true);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    public Review getReviewById(String id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with ID: " + id));
    }

    public Review submitReview(Review review) {
        review.setApproved(false); // Moderation required
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public Review approveReview(String id) {
        Review review = getReviewById(id);
        review.setApproved(true);
        return reviewRepository.save(review);
    }

    public void deleteReview(String id) {
        Review review = getReviewById(id);
        reviewRepository.delete(review);
    }
}
