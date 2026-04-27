package com.cashback.engine.controller;

import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.dto.response.TransactionResponse;
import com.cashback.engine.security.UserPrincipal;
import com.cashback.engine.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getUserTransactions(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.getUserTransactions(principal.getId())));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getAllTransactions() {
        return ResponseEntity.ok(ApiResponse.success(transactionService.getAllTransactions()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TransactionResponse>> updateStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.updateTransactionStatus(id, status)));
    }
}
