package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cashbackengine_retailer_to_country")
@IdClass(RetailerToCountryId.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RetailerToCountry {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "retailer_id")
    private Retailer retailer;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id")
    private Country country;
}
