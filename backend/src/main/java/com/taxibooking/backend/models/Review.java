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
@Document(collection = "reviews")
public class Review {
    @Id
    private String id;
    
    private String name;
    private Integer rating; // 1 to 5
    private String review;
    private Boolean approved = false; // Initial status is unapproved (moderation)
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
