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

    @Column(name = "retailer_id")
    private Integer retailerId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "promo_id", length = 16)
    @Builder.Default
    private String promoId = "";

    @Column(name = "coupon_type", length = 20)
    @Builder.Default
    private String couponType = "Coupon";

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "code", length = 255)
    private String code;

    @Column(name = "link", columnDefinition = "TEXT")
    private String link;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "exclusive")
    @Builder.Default
    private Integer exclusive = 0;

    @Column(name = "visits")
    @Builder.Default
    private Integer visits = 0;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(name = "viewed")
    @Builder.Default
    private Integer viewed = 1;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "active";

    @Column(name = "added")
    private LocalDateTime added;

    @Column(name = "old_offer", length = 20)
    private String oldOffer;

    @Column(name = "offer", length = 20)
    private String offer;

    @Column(name = "offer_img", length = 256)
    private String offerImg;

    @Column(name = "special")
    @Builder.Default
    private Integer special = 0;

    @Column(name = "banner_img", length = 256)
    private String bannerImg;

    @Column(name = "offer_template", length = 32)
    private String offerTemplate;

    @PrePersist
    protected void onCreate() {
        if (added == null) added = LocalDateTime.now();
    }
}
