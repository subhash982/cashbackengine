package com.cashback.engine.dto.response;

import com.cashback.engine.domain.Coupon;
import com.cashback.engine.domain.Retailer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponWithRetailerResponse {

    private Integer couponId;
    private Integer retailerId;
    private String title;
    private String code;
    private String description;
    private String couponType;
    private LocalDateTime endDate;
    private String status;
    private String link;

    // Retailer fields
    private String retailerTitle;
    private String retailerImage;
    private String retailerUrl;
    private String retailerCashback;
    private String retailerConditions;

    public static CouponWithRetailerResponse from(Coupon c, Retailer r) {
        return CouponWithRetailerResponse.builder()
                .couponId(c.getCouponId())
                .retailerId(c.getRetailerId())
                .title(c.getTitle())
                .code(c.getCode())
                .description(c.getDescription())
                .couponType(c.getCouponType())
                .endDate(c.getEndDate())
                .status(c.getStatus())
                .link(c.getLink())
                .retailerTitle(r != null ? r.getTitle() : null)
                .retailerImage(r != null ? r.getImage() : null)
                .retailerUrl(r != null ? r.getUrl() : null)
                .retailerCashback(r != null ? r.getCashback() : null)
                .retailerConditions(r != null ? r.getConditions() : null)
                .build();
    }
}
