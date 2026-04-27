package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cashbackengine_messages_answers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MessageAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Integer answerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "is_admin")
    @Builder.Default
    private Boolean isAdmin = false;

    @Column(name = "answer", columnDefinition = "TEXT")
    private String answer;

    @Column(name = "viewed")
    @Builder.Default
    private Boolean viewed = false;

    @Column(name = "answer_date", nullable = false)
    private LocalDateTime answerDate;

    @PrePersist
    protected void onCreate() {
        if (answerDate == null) answerDate = LocalDateTime.now();
    }
}
