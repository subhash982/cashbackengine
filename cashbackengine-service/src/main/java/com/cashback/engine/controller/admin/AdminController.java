package com.cashback.engine.controller.admin;

import com.cashback.engine.domain.Review;
import com.cashback.engine.domain.User;
import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.dto.response.ReviewResponse;
import com.cashback.engine.dto.response.UserResponse;
import com.cashback.engine.repository.RetailerRepository;
import com.cashback.engine.repository.ReviewRepository;
import com.cashback.engine.repository.TransactionRepository;
import com.cashback.engine.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final RetailerRepository retailerRepository;
    private final TransactionRepository transactionRepository;
    private final ReviewRepository reviewRepository;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll()
                .stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        user.setRole(body.get("role"));
        user = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Role updated", UserResponse.from(user)));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        user.setStatus(body.get("status"));
        user = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Status updated", UserResponse.from(user)));
    }

    // ── Reviews ──────────────────────────────────────────────────────────────

    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getAllReviews() {
        List<ReviewResponse> reviews = reviewRepository.findAllWithAssociations()
                .stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @PutMapping("/reviews/{id}/status")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReviewStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {
        Review review = reviewRepository.findAllWithAssociations()
                .stream()
                .filter(r -> r.getReviewId().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Review not found: " + id));
        review.setStatus(body.get("status"));
        reviewRepository.save(review);
        return ResponseEntity.ok(ApiResponse.success("Status updated", ReviewResponse.from(review)));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Integer id) {
        reviewRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted", null));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemStats() {
        long totalUsers = userRepository.count();
        long totalRetailers = retailerRepository.count();
        long totalTransactions = transactionRepository.count();
        long pendingTransactions = transactionRepository.countByStatus("pending");

        Map<String, Object> stats = Map.of(
                "totalUsers", totalUsers,
                "totalRetailers", totalRetailers,
                "totalTransactions", totalTransactions,
                "pendingTransactions", pendingTransactions
        );
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
