package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cashbackengine_clickhistory")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClickHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "click_id")
    private Integer clickId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "retailer_id", nullable = false)
    private Retailer retailer;

    @Column(name = "added", nullable = false)
    private LocalDateTime added;

    @PrePersist
    protected void onCreate() {
        if (added == null) added = LocalDateTime.now();
    }
}
