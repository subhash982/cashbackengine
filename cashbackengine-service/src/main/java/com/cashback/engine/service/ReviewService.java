package com.cashback.engine.service;

import com.cashback.engine.domain.Retailer;
import com.cashback.engine.domain.Review;
import com.cashback.engine.domain.User;
import com.cashback.engine.dto.request.ReviewRequest;
import com.cashback.engine.dto.response.ReviewResponse;
import com.cashback.engine.repository.RetailerRepository;
import com.cashback.engine.repository.ReviewRepository;
import com.cashback.engine.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RetailerRepository retailerRepository;
    private final UserRepository userRepository;

    public List<ReviewResponse> getReviewsByRetailerId(Integer retailerId) {
        return reviewRepository.findByRetailerRetailerId(retailerId)
                .stream()
                .filter(r -> "active".equalsIgnoreCase(r.getStatus()))
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional
    public ReviewResponse addReview(Integer retailerId, Integer userId, ReviewRequest request) {
        if (reviewRepository.existsByRetailerRetailerIdAndUserUserId(retailerId, userId)) {
            throw new IllegalStateException("You can only submit one review for one store");
        }

        Retailer retailer = retailerRepository.findById(retailerId)
                .orElseThrow(() -> new RuntimeException("Retailer not found: " + retailerId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Review review = Review.builder()
                .retailer(retailer)
                .user(user)
                .rating(request.getRating())
                .reviewTitle(request.getReviewTitle())
                .review(request.getReview())
                .status("pending")
                .build();

        Review saved = reviewRepository.save(review);
        return ReviewResponse.from(saved);
    }
}
