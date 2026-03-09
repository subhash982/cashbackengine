package com.cashback.engine.dto.response;

import com.cashback.engine.domain.transaction.Transaction;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class TransactionResponse {
    private Long id;
    private String transactionId;
    private Long merchantId;
    private String merchantName;
    private BigDecimal orderValue;
    private BigDecimal commission;
    private BigDecimal cashbackAmount;
    private String currency;
    private String status;
    private boolean fraudSuspected;
    private Instant createdAt;
    private Instant confirmedAt;
    private Instant paidAt;

    public static TransactionResponse from(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .transactionId(t.getTransactionId())
                .merchantId(t.getMerchant().getId())
                .merchantName(t.getMerchant().getName())
                .orderValue(t.getOrderValue())
                .commission(t.getCommission())
                .cashbackAmount(t.getCashbackAmount())
                .currency(t.getCurrency())
                .status(t.getStatus().name())
                .fraudSuspected(t.isFraudSuspected())
                .createdAt(t.getCreatedAt())
                .confirmedAt(t.getConfirmedAt())
                .paidAt(t.getPaidAt())
                .build();
    }
}
