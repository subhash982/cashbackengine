package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cashbackengine_pmethods")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pmethod_id")
    private Integer pmethodId;

    @Column(name = "pmethod_title", nullable = false, length = 100)
    private String pmethodTitle;

    @Column(name = "pmethod_details", columnDefinition = "TEXT")
    private String pmethodDetails;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "active";
}
