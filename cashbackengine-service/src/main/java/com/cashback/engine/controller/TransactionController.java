package com.cashback.engine.controller;

import com.cashback.engine.dto.request.ConversionWebhookRequest;
import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.dto.response.TransactionResponse;
import com.cashback.engine.security.UserPrincipal;
import com.cashback.engine.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * Webhook endpoint for affiliate networks to post conversion events.
     */
    @PostMapping("/api/v1/webhook/conversion")
    public ResponseEntity<ApiResponse<TransactionResponse>> conversionWebhook(
            @Valid @RequestBody ConversionWebhookRequest request) {
        var transaction = transactionService.processConversion(request);
        return ResponseEntity.ok(ApiResponse.success("Conversion processed", TransactionResponse.from(transaction)));
    }

    /**
     * Get authenticated user's transaction history.
     */
    @GetMapping("/api/v1/transactions")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getUserTransactions(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<TransactionResponse> page = transactionService.getUserTransactions(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }
}
