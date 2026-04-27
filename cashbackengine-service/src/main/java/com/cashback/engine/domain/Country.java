package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cashbackengine_countries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "country_id")
    private Integer countryId;

    @Column(name = "code", nullable = false, length = 2)
    private String code;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "currency", length = 3)
    private String currency;

    @Column(name = "signup")
    @Builder.Default
    private Boolean signup = false;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "active";
}
