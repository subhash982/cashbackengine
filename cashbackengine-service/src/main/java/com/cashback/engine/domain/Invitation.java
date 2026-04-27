package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cashbackengine_invitations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invitation_id")
    private Integer invitationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "recipients", columnDefinition = "TEXT")
    private String recipients;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "sent_date", nullable = false)
    private LocalDateTime sentDate;

    @PrePersist
    protected void onCreate() {
        if (sentDate == null) sentDate = LocalDateTime.now();
    }
}
