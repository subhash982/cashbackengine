package com.cashback.engine.controller;

import com.cashback.engine.dto.request.PayoutRequest;
import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.security.UserPrincipal;
import com.cashback.engine.service.PayoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payouts")
@RequiredArgsConstructor
public class PayoutController {

    private final PayoutService payoutService;

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> requestPayout(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PayoutRequest request) {
        Map<String, Object> payout = payoutService.requestPayout(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Payout request submitted", payout));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Map<String, Object>>>> getUserPayouts(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<Map<String, Object>> payouts = payoutService.getUserPayouts(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(payouts));
    }
}
