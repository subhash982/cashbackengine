package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cashbackengine_email_templates")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmailTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "template_id")
    private Integer templateId;

    @Column(name = "language", length = 50)
    private String language;

    @Column(name = "email_name", length = 50)
    private String emailName;

    @Column(name = "email_subject", length = 255)
    private String emailSubject;

    @Column(name = "email_message", columnDefinition = "TEXT")
    private String emailMessage;

    @Column(name = "modified", nullable = false)
    private LocalDateTime modified;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        modified = LocalDateTime.now();
    }
}
