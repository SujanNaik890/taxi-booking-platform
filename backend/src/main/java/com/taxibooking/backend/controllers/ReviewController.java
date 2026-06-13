package com.taxibooking.backend.controllers;

import com.taxibooking.backend.models.Review;
import com.taxibooking.backend.services.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Public: Get only approved reviews
    @GetMapping
    public ResponseEntity<List<Review>> getApprovedReviews() {
        return ResponseEntity.ok(reviewService.getApprovedReviews());
    }

    // Admin: Get all reviews (approved and unapproved)
    @GetMapping("/admin")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // Public: Submit a review (unapproved initially)
    @PostMapping
    public ResponseEntity<Review> submitReview(@Valid @RequestBody Review review) {
        return ResponseEntity.ok(reviewService.submitReview(review));
    }

    // Admin: Approve a review
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveReview(@PathVariable String id) {
        try {
            Review approved = reviewService.approveReview(id);
            return ResponseEntity.ok(approved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin: Delete a review
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable String id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok().body("Review deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
