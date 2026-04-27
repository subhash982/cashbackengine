package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cashbackengine_coupons")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coupon_id")
    private Integer couponId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "retailer_id", nullable = false)
    private Retailer retailer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "code", length = 255)
    private String code;

    @Column(name = "link", length = 255)
    private String link;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "exclusive")
    @Builder.Default
    private Boolean exclusive = false;

    @Column(name = "visits")
    @Builder.Default
    private Integer visits = 0;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(name = "viewed")
    @Builder.Default
    private Boolean viewed = false;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "active";

    @Column(name = "added", nullable = false)
    private LocalDateTime added;

    @PrePersist
    protected void onCreate() {
        if (added == null) added = LocalDateTime.now();
    }
}
