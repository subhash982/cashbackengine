package com.cashback.engine.controller;

import com.cashback.engine.dto.request.RetailerRequest;
import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.dto.response.RetailerResponse;
import com.cashback.engine.service.RetailerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/retailers")
@RequiredArgsConstructor
public class RetailerController {

    private final RetailerService retailerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RetailerResponse>>> getAllRetailers() {
        return ResponseEntity.ok(ApiResponse.success(retailerService.getAllRetailers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RetailerResponse>> getRetailerById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(retailerService.getRetailerById(id)));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<RetailerResponse>>> getAllActiveRetailers() {
        return ResponseEntity.ok(ApiResponse.success(retailerService.getAllActiveRetailers()));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<RetailerResponse>>> getFeaturedRetailers() {
        return ResponseEntity.ok(ApiResponse.success(retailerService.getFeaturedRetailers()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<RetailerResponse>>> searchRetailers(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.success(retailerService.searchRetailers(q)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RetailerResponse>> createRetailer(@Valid @RequestBody RetailerRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Retailer created", retailerService.createRetailer(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RetailerResponse>> updateRetailer(
            @PathVariable Integer id,
            @Valid @RequestBody RetailerRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Retailer updated", retailerService.updateRetailer(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRetailer(@PathVariable Integer id) {
        retailerService.deleteRetailer(id);
        return ResponseEntity.ok(ApiResponse.success("Retailer deleted", null));
    }
}
