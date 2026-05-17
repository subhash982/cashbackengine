package com.cashback.engine.dto.response;

import com.cashback.engine.domain.Favorite;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FavoriteResponse {

    private Integer favoriteId;
    private Integer retailerId;
    private String retailerTitle;
    private String retailerUrl;
    private String retailerImage;
    private String retailerCashback;
    private String retailerDescription;
    private LocalDateTime added;
    private int couponCount;

    public static FavoriteResponse from(Favorite f, int couponCount) {
        return FavoriteResponse.builder()
                .favoriteId(f.getFavoriteId())
                .retailerId(f.getRetailer().getRetailerId())
                .retailerTitle(f.getRetailer().getTitle())
                .retailerUrl(f.getRetailer().getUrl())
                .retailerImage(f.getRetailer().getImage())
                .retailerCashback(f.getRetailer().getCashback())
                .retailerDescription(f.getRetailer().getDescription())
                .added(f.getAdded())
                .couponCount(couponCount)
                .build();
    }
}
