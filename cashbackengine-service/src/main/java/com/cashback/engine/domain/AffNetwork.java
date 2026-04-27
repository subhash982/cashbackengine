package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cashbackengine_affnetworks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AffNetwork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "network_id")
    private Integer networkId;

    @Column(name = "network_name", nullable = false, length = 255)
    private String networkName;

    @Column(name = "website", nullable = false, length = 255)
    private String website;

    @Column(name = "image", nullable = false, length = 100)
    private String image;

    @Column(name = "csv_format", nullable = false, columnDefinition = "TEXT")
    private String csvFormat;

    @Column(name = "confirmeds", nullable = false, length = 100)
    private String confirmeds;

    @Column(name = "pendings", nullable = false, length = 100)
    private String pendings;

    @Column(name = "declineds", nullable = false, length = 100)
    private String declineds;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "active";

    @Column(name = "added", nullable = false)
    private LocalDateTime added;

    @Column(name = "last_csv_upload")
    private LocalDateTime lastCsvUpload;

    @PrePersist
    protected void onCreate() {
        if (added == null) added = LocalDateTime.now();
    }
}
