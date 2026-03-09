package com.cashback.engine.dto.request;

import com.cashback.engine.domain.payout.PayoutMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PayoutRequest {

    @NotNull
    @Positive
    private BigDecimal amount;

    @NotNull
    private PayoutMethod payoutMethod;

    @NotBlank
    private String payoutDestination;
}
