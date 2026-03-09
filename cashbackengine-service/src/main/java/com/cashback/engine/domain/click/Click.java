package com.cashback.engine.domain.click;

import com.cashback.engine.domain.merchant.Merchant;
import com.cashback.engine.domain.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "clicks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Click {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    @Builder.Default
    private String clickId = UUID.randomUUID().toString();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @Column(length = 45)
    private String ipAddress;

    @Column(length = 500)
    private String userAgent;

    @Column(length = 100)
    private String device;

    @Column(length = 100)
    private String sessionId;

    @Column(length = 100)
    private String referrer;

    @Column(nullable = false)
    @Builder.Default
    private boolean fraudSuspected = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant clickedAt;
}
