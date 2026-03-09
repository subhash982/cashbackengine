package com.cashback.engine.domain.wallet;

import com.cashback.engine.domain.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "wallets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal pendingAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal confirmedAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal withdrawableAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal totalPaidAmount = BigDecimal.ZERO;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String currency = "USD";

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}
