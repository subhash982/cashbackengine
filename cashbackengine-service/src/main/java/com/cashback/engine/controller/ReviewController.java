package com.cashback.engine.controller;

import com.cashback.engine.dto.request.ReviewRequest;
import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.dto.response.ReviewResponse;
import com.cashback.engine.security.UserPrincipal;
import com.cashback.engine.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/retailer/{retailerId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviews(@PathVariable Integer retailerId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getReviewsByRetailerId(retailerId)));
    }

    @PostMapping("/retailer/{retailerId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> addReview(
            @PathVariable Integer retailerId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ReviewResponse response = reviewService.addReview(retailerId, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", response));
    }
}
