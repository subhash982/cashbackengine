package com.cashback.engine.controller;

import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.dto.response.WalletResponse;
import com.cashback.engine.security.UserPrincipal;
import com.cashback.engine.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<ApiResponse<WalletResponse>> getWallet(
            @AuthenticationPrincipal UserPrincipal principal) {
        WalletResponse wallet = walletService.getWallet(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(wallet));
    }
}
