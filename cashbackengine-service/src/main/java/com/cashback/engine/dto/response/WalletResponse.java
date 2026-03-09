package com.cashback.engine.dto.response;

import com.cashback.engine.domain.wallet.Wallet;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class WalletResponse {
    private Long userId;
    private BigDecimal pendingAmount;
    private BigDecimal confirmedAmount;
    private BigDecimal withdrawableAmount;
    private BigDecimal totalPaidAmount;
    private String currency;
    private Instant updatedAt;

    public static WalletResponse from(Wallet wallet) {
        return WalletResponse.builder()
                .userId(wallet.getUser().getId())
                .pendingAmount(wallet.getPendingAmount())
                .confirmedAmount(wallet.getConfirmedAmount())
                .withdrawableAmount(wallet.getWithdrawableAmount())
                .totalPaidAmount(wallet.getTotalPaidAmount())
                .currency(wallet.getCurrency())
                .updatedAt(wallet.getUpdatedAt())
                .build();
    }
}
