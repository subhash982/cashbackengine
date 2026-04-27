package com.cashback.engine.domain;

import java.io.Serializable;
import java.util.Objects;

public class RetailerToCategoryId implements Serializable {

    private Integer retailer;
    private Integer category;

    public RetailerToCategoryId() {}

    public RetailerToCategoryId(Integer retailer, Integer category) {
        this.retailer = retailer;
        this.category = category;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RetailerToCategoryId)) return false;
        RetailerToCategoryId that = (RetailerToCategoryId) o;
        return Objects.equals(retailer, that.retailer) && Objects.equals(category, that.category);
    }

    @Override
    public int hashCode() {
        return Objects.hash(retailer, category);
    }
}
