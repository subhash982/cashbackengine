package com.cashback.engine.dto.response;

import com.cashback.engine.domain.Transaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Integer transactionId;
    private String referenceId;
    private Integer networkId;
    private String retailer;
    private String programId;
    private Integer userId;
    private String paymentType;
    private BigDecimal transactionAmount;
    private BigDecimal transactionCommission;
    private BigDecimal amount;
    private String status;
    private String reason;
    private LocalDateTime created;
    private LocalDateTime updated;
    private LocalDateTime processDate;

    public static TransactionResponse from(Transaction t) {
        return TransactionResponse.builder()
                .transactionId(t.getTransactionId())
                .referenceId(t.getReferenceId())
                .networkId(t.getNetworkId())
                .retailer(t.getRetailer())
                .programId(t.getProgramId())
                .userId(t.getUser() != null ? t.getUser().getUserId() : null)
                .paymentType(t.getPaymentType())
                .transactionAmount(t.getTransactionAmount())
                .transactionCommission(t.getTransactionCommission())
                .amount(t.getAmount())
                .status(t.getStatus())
                .reason(t.getReason())
                .created(t.getCreated())
                .updated(t.getUpdated())
                .processDate(t.getProcessDate())
                .build();
    }
}
