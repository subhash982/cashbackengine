package com.cashback.engine.dto.response;

import com.cashback.engine.domain.merchant.Merchant;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class MerchantResponse {
    private Long id;
    private String name;
    private String description;
    private String websiteUrl;
    private String logoUrl;
    private String category;
    private String affiliateNetwork;
    private BigDecimal defaultCommissionRate;
    private BigDecimal userSharePercentage;
    private boolean active;

    public static MerchantResponse from(Merchant m) {
        return MerchantResponse.builder()
                .id(m.getId())
                .name(m.getName())
                .description(m.getDescription())
                .websiteUrl(m.getWebsiteUrl())
                .logoUrl(m.getLogoUrl())
                .category(m.getCategory())
                .affiliateNetwork(m.getAffiliateNetwork())
                .defaultCommissionRate(m.getDefaultCommissionRate())
                .userSharePercentage(m.getUserSharePercentage())
                .active(m.isActive())
                .build();
    }
}
