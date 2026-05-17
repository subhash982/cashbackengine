package com.cashback.engine.controller;

import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.dto.response.ClickHistoryResponse;
import com.cashback.engine.security.UserPrincipal;
import com.cashback.engine.service.ClickHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clicks")
@RequiredArgsConstructor
public class ClickHistoryController {

    private final ClickHistoryService clickHistoryService;

    @PostMapping("/{retailerId}")
    public ResponseEntity<ApiResponse<Void>> logClick(
            @PathVariable Integer retailerId,
            @AuthenticationPrincipal UserPrincipal principal) {
        clickHistoryService.logClick(principal.getId(), retailerId);
        return ResponseEntity.ok(ApiResponse.success("Click logged", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClickHistoryResponse>>> getMyHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ClickHistoryResponse> history = clickHistoryService.getMyHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Click history fetched", history));
    }
}
