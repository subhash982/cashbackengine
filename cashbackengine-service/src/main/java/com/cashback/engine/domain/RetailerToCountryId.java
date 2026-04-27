package com.cashback.engine.domain;

import java.io.Serializable;
import java.util.Objects;

public class RetailerToCountryId implements Serializable {

    private Integer retailer;
    private Integer country;

    public RetailerToCountryId() {}

    public RetailerToCountryId(Integer retailer, Integer country) {
        this.retailer = retailer;
        this.country = country;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RetailerToCountryId)) return false;
        RetailerToCountryId that = (RetailerToCountryId) o;
        return Objects.equals(retailer, that.retailer) && Objects.equals(country, that.country);
    }

    @Override
    public int hashCode() {
        return Objects.hash(retailer, country);
    }
}
