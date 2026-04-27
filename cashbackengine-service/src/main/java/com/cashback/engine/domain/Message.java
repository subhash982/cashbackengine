package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cashbackengine_messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Integer messageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "is_admin")
    @Builder.Default
    private Boolean isAdmin = false;

    @Column(name = "subject", length = 100)
    private String subject;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "viewed")
    @Builder.Default
    private Boolean viewed = false;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "new";

    @Column(name = "created", nullable = false)
    private LocalDateTime created;

    @PrePersist
    protected void onCreate() {
        if (created == null) created = LocalDateTime.now();
    }
}
