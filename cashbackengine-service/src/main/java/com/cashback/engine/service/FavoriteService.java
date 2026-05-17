package com.cashback.engine.service;

import com.cashback.engine.domain.Favorite;
import com.cashback.engine.domain.Retailer;
import com.cashback.engine.domain.User;
import com.cashback.engine.dto.response.FavoriteResponse;
import com.cashback.engine.repository.CouponRepository;
import com.cashback.engine.repository.FavoriteRepository;
import com.cashback.engine.repository.RetailerRepository;
import com.cashback.engine.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final RetailerRepository retailerRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;

    @Transactional(readOnly = true)
    public List<FavoriteResponse> getFavorites(Integer userId) {
        LocalDateTime now = LocalDateTime.now();
        return favoriteRepository.findByUserUserId(userId)
                .stream()
                .map(f -> {
                    int count = (int) couponRepository.countActiveByRetailerId(
                            f.getRetailer().getRetailerId(), now);
                    return FavoriteResponse.from(f, count);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public FavoriteResponse addFavorite(Integer userId, Integer retailerId) {
        if (favoriteRepository.existsByUserUserIdAndRetailerRetailerId(userId, retailerId)) {
            throw new IllegalStateException("Store is already in your favorites");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Retailer retailer = retailerRepository.findById(retailerId)
                .orElseThrow(() -> new IllegalArgumentException("Retailer not found"));

        Favorite saved = favoriteRepository.save(Favorite.builder()
                .user(user).retailer(retailer).build());
        int count = (int) couponRepository.countActiveByRetailerId(retailerId, LocalDateTime.now());
        return FavoriteResponse.from(saved, count);
    }

    @Transactional
    public void removeFavorite(Integer userId, Integer retailerId) {
        favoriteRepository.deleteByUserUserIdAndRetailerRetailerId(userId, retailerId);
    }
}
