package com.cashback.engine.dto.response;

import com.cashback.engine.domain.Review;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {

    private Integer reviewId;
    private Integer retailerId;
    private String retailerTitle;
    private Integer rating;
    private String reviewTitle;
    private String review;
    private String status;
    private LocalDateTime added;
    private String userName;

    public static ReviewResponse from(Review r) {
        return ReviewResponse.builder()
                .reviewId(r.getReviewId())
                .retailerId(r.getRetailer() != null ? r.getRetailer().getRetailerId() : null)
                .retailerTitle(r.getRetailer() != null ? r.getRetailer().getTitle() : null)
                .rating(r.getRating())
                .reviewTitle(r.getReviewTitle())
                .review(r.getReview())
                .status(r.getStatus())
                .added(r.getAdded())
                .userName(r.getUser() != null ? r.getUser().getUsername() : "Anonymous")
                .build();
    }
}
