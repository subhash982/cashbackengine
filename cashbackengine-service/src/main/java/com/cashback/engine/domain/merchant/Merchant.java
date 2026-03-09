package com.cashback.engine.domain.merchant;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "merchants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Merchant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, length = 500)
    private String websiteUrl;

    @Column(length = 500)
    private String affiliateTrackingUrl;

    @Column(length = 100)
    private String logoUrl;

    @Column(length = 100)
    private String category;

    @Column(nullable = false, length = 50)
    private String affiliateNetwork;

    @Column(length = 100)
    private String affiliateNetworkMerchantId;

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal defaultCommissionRate = BigDecimal.ZERO;

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal userSharePercentage = new BigDecimal("70.00");

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}
