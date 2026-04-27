package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cashbackengine_content")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id")
    private Integer contentId;

    @Column(name = "language", length = 50)
    private String language;

    @Column(name = "name", length = 50)
    private String name;

    @Column(name = "link_title", length = 100)
    private String linkTitle;

    @Column(name = "title", length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "page_location", length = 10)
    private String pageLocation;

    @Column(name = "page_url", length = 255)
    private String pageUrl;

    @Column(name = "meta_description", length = 255)
    private String metaDescription;

    @Column(name = "meta_keywords", length = 255)
    private String metaKeywords;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "active";

    @Column(name = "modified", nullable = false)
    private LocalDateTime modified;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        modified = LocalDateTime.now();
    }
}
