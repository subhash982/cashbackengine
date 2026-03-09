package com.cashback.engine.controller;

import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.dto.response.MerchantResponse;
import com.cashback.engine.service.MerchantService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/merchants")
@RequiredArgsConstructor
public class MerchantController {

    private final MerchantService merchantService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<MerchantResponse>>> getActiveMerchants(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(merchantService.getActiveMerchants(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MerchantResponse>> getMerchant(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(merchantService.getMerchant(id)));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<MerchantResponse>>> getMerchantsByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success(merchantService.getMerchantsByCategory(category)));
    }
}
