package com.cashback.engine.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ConversionWebhookRequest {

    @NotBlank
    private String clickId;

    @NotBlank
    private String transactionId;

    @NotNull
    @Positive
    private BigDecimal orderValue;

    @NotNull
    @Positive
    private BigDecimal commission;

    private String currency = "USD";

    private String affiliateNetwork;

    private String networkTransactionId;
}
