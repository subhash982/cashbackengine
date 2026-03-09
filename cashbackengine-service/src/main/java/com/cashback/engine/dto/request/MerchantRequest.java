package com.cashback.engine.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class MerchantRequest {

    @NotBlank
    private String name;

    private String description;

    @NotBlank
    private String websiteUrl;

    private String affiliateTrackingUrl;

    private String logoUrl;

    private String category;

    @NotBlank
    private String affiliateNetwork;

    private String affiliateNetworkMerchantId;

    @NotNull
    private BigDecimal defaultCommissionRate;

    private BigDecimal userSharePercentage = new BigDecimal("70.00");
}
