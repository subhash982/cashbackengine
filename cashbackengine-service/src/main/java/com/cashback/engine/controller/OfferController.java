package com.cashback.engine.controller;

import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.service.OfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Map<String, Object>>>> getActiveOffers(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(offerService.getActiveOffers(pageable)));
    }

    @GetMapping("/merchant/{merchantId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getOffersByMerchant(
            @PathVariable Long merchantId) {
        return ResponseEntity.ok(ApiResponse.success(offerService.getOffersByMerchant(merchantId)));
    }
}
