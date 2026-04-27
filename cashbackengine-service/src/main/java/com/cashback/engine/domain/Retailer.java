package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cashbackengine_retailers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Retailer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "retailer_id")
    private Integer retailerId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "network_id")
    private AffNetwork network;

    @Column(name = "program_id", length = 255)
    private String programId;

    @Column(name = "url", nullable = false, length = 255)
    private String url;

    @Column(name = "image", length = 255)
    private String image;

    @Column(name = "old_cashback", length = 20)
    private String oldCashback;

    @Column(name = "cashback", length = 20)
    private String cashback;

    @Column(name = "conditions", columnDefinition = "TEXT")
    private String conditions;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "retailer_url", length = 255)
    private String retailerUrl;

    @Column(name = "meta_description", length = 255)
    private String metaDescription;

    @Column(name = "meta_keywords", length = 255)
    private String metaKeywords;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "featured")
    @Builder.Default
    private Boolean featured = false;

    @Column(name = "deal_of_week")
    @Builder.Default
    private Boolean dealOfWeek = false;

    @Column(name = "visits")
    @Builder.Default
    private Integer visits = 0;

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
