package com.cashback.engine.dto.request;

import com.cashback.engine.domain.offer.OfferType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
public class OfferRequest {

    @NotNull
    private Long merchantId;

    @NotBlank
    private String title;

    private String description;

    private OfferType offerType = OfferType.STANDARD;

    @NotNull
    @Positive
    private BigDecimal cashbackPercentage;

    private String category;

    private Instant startDate;

    private Instant endDate;

    private String campaignCode;
}
