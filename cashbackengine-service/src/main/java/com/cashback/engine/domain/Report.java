package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cashbackengine_reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer reportId;

    @Column(name = "reporter_id")
    private Integer reporterId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "retailer_id")
    private Retailer retailer;

    @Column(name = "report", columnDefinition = "TEXT")
    private String report;

    @Column(name = "viewed")
    @Builder.Default
    private Boolean viewed = false;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "pending";

    @Column(name = "added", nullable = false)
    private LocalDateTime added;

    @PrePersist
    protected void onCreate() {
        if (added == null) added = LocalDateTime.now();
    }
}
