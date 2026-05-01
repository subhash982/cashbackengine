package com.cashback.engine.controller;

import com.cashback.engine.dto.request.AffNetworkRequest;
import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.dto.response.AffNetworkResponse;
import com.cashback.engine.service.AffNetworkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/affnetworks")
@RequiredArgsConstructor
public class AffNetworkController {

    private final AffNetworkService affNetworkService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AffNetworkResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(affNetworkService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AffNetworkResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(affNetworkService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AffNetworkResponse>> create(@Valid @RequestBody AffNetworkRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Network created", affNetworkService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AffNetworkResponse>> update(
            @PathVariable Integer id,
            @Valid @RequestBody AffNetworkRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Network updated", affNetworkService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        affNetworkService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Network deleted", null));
    }
}
