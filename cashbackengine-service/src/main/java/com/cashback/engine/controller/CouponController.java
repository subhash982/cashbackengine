package com.cashback.engine.controller;

import com.cashback.engine.domain.Coupon;
import com.cashback.engine.dto.request.CouponRequest;
import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Coupon>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "all") String status) {
        return ResponseEntity.ok(ApiResponse.success(couponService.getAll(page, size, status)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Coupon>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(couponService.getById(id)));
    }

    @GetMapping("/retailer/{retailerId}")
    public ResponseEntity<ApiResponse<List<Coupon>>> getByRetailer(@PathVariable Integer retailerId) {
        return ResponseEntity.ok(ApiResponse.success(couponService.getByRetailer(retailerId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Coupon>> create(@Valid @RequestBody CouponRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Coupon created", couponService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Coupon>> update(
            @PathVariable Integer id,
            @Valid @RequestBody CouponRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Coupon updated", couponService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        couponService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted", null));
    }
}
