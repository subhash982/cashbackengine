package com.cashback.engine.controller.admin;

import com.cashback.engine.domain.payout.PayoutStatus;
import com.cashback.engine.domain.transaction.TransactionStatus;
import com.cashback.engine.dto.request.MerchantRequest;
import com.cashback.engine.dto.request.OfferRequest;
import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.dto.response.MerchantResponse;
import com.cashback.engine.dto.response.TransactionResponse;
import com.cashback.engine.repository.TransactionRepository;
import com.cashback.engine.repository.UserRepository;
import com.cashback.engine.service.MerchantService;
import com.cashback.engine.service.OfferService;
import com.cashback.engine.service.PayoutService;
import com.cashback.engine.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final MerchantService merchantService;
    private final OfferService offerService;
    private final TransactionService transactionService;
    private final PayoutService payoutService;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    // ---- Merchant Management ----

    @PostMapping("/merchants")
    public ResponseEntity<ApiResponse<MerchantResponse>> createMerchant(
            @Valid @RequestBody MerchantRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Merchant created", merchantService.createMerchant(request)));
    }

    @PutMapping("/merchants/{id}")
    public ResponseEntity<ApiResponse<MerchantResponse>> updateMerchant(
            @PathVariable Long id, @Valid @RequestBody MerchantRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Merchant updated", merchantService.updateMerchant(id, request)));
    }

    @DeleteMapping("/merchants/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivateMerchant(@PathVariable Long id) {
        merchantService.deactivateMerchant(id);
        return ResponseEntity.ok(ApiResponse.success("Merchant deactivated", null));
    }

    // ---- Offer Management ----

    @PostMapping("/offers")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOffer(
            @Valid @RequestBody OfferRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Offer created", offerService.createOffer(request)));
    }

    @DeleteMapping("/offers/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivateOffer(@PathVariable Long id) {
        offerService.deactivateOffer(id);
        return ResponseEntity.ok(ApiResponse.success("Offer deactivated", null));
    }

    // ---- Transaction Management ----

    @PatchMapping("/transactions/{id}/status")
    public ResponseEntity<ApiResponse<TransactionResponse>> updateTransactionStatus(
            @PathVariable Long id, @RequestParam TransactionStatus status) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.updateStatus(id, status)));
    }

    // ---- Payout Management ----

    @PatchMapping("/payouts/{id}/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updatePayoutStatus(
            @PathVariable Long id,
            @RequestParam PayoutStatus status,
            @RequestParam(required = false) String externalTxId) {
        return ResponseEntity.ok(ApiResponse.success(payoutService.updatePayoutStatus(id, status, externalTxId)));
    }

    // ---- Analytics Dashboard ----

    @GetMapping("/analytics/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalyticsSummary() {
        Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);
        long totalUsers = userRepository.count();
        long recentTransactions = transactionRepository.countTransactionsSince(thirtyDaysAgo);
        var totalRevenue = transactionRepository.sumOrderValueSince(thirtyDaysAgo);

        Map<String, Object> summary = Map.of(
                "totalUsers", totalUsers,
                "transactionsLast30Days", recentTransactions,
                "revenueLastLast30Days", totalRevenue.orElse(java.math.BigDecimal.ZERO)
        );
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
