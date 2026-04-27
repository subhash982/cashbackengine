package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cashbackengine_retailer_to_category")
@IdClass(RetailerToCategoryId.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RetailerToCategory {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "retailer_id")
    private Retailer retailer;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
}
