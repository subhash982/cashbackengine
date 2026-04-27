package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cashbackengine_settings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Setting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "setting_id")
    private Integer settingId;

    @Column(name = "setting_key", nullable = false, unique = true, length = 50)
    private String settingKey;

    @Column(name = "setting_value", columnDefinition = "TEXT")
    private String settingValue;
}
