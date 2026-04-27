package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cashbackengine_transactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Integer transactionId;

    @Column(name = "reference_id", length = 50)
    private String referenceId;

    @Column(name = "network_id")
    private Integer networkId;

    @Column(name = "retailer", length = 100)
    private String retailer;

    @Column(name = "program_id", length = 100)
    private String programId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "ref_id")
    private Integer refId;

    @Column(name = "payment_type", length = 50)
    private String paymentType;

    @Column(name = "payment_method")
    private Integer paymentMethod;

    @Column(name = "payment_details", columnDefinition = "TEXT")
    private String paymentDetails;

    @Column(name = "transaction_amount", precision = 15, scale = 4)
    private BigDecimal transactionAmount;

    @Column(name = "transaction_commission", precision = 15, scale = 4)
    private BigDecimal transactionCommission;

    @Column(name = "amount", precision = 15, scale = 4)
    private BigDecimal amount;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "pending";

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "created", nullable = false)
    private LocalDateTime created;

    @Column(name = "updated", nullable = false)
    private LocalDateTime updated;

    @Column(name = "process_date")
    private LocalDateTime processDate;

    @PrePersist
    protected void onCreate() {
        if (created == null) created = LocalDateTime.now();
        if (updated == null) updated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updated = LocalDateTime.now();
    }
}
