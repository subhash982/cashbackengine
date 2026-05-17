package com.cashback.engine.controller;

import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.dto.response.FavoriteResponse;
import com.cashback.engine.security.UserPrincipal;
import com.cashback.engine.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(favoriteService.getFavorites(principal.getId())));
    }

    @PostMapping("/{retailerId}")
    public ResponseEntity<ApiResponse<FavoriteResponse>> addFavorite(
            @PathVariable Integer retailerId,
            @AuthenticationPrincipal UserPrincipal principal) {
        FavoriteResponse response = favoriteService.addFavorite(principal.getId(), retailerId);
        return ResponseEntity.ok(ApiResponse.success("Store added to favorites", response));
    }

    @DeleteMapping("/{retailerId}")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @PathVariable Integer retailerId,
            @AuthenticationPrincipal UserPrincipal principal) {
        favoriteService.removeFavorite(principal.getId(), retailerId);
        return ResponseEntity.ok(ApiResponse.success("Store removed from favorites", null));
    }
}
