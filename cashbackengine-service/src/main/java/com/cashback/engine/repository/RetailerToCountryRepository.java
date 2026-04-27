package com.cashback.engine.repository;

import com.cashback.engine.domain.RetailerToCountry;
import com.cashback.engine.domain.RetailerToCountryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RetailerToCountryRepository extends JpaRepository<RetailerToCountry, RetailerToCountryId> {

    List<RetailerToCountry> findByRetailerRetailerId(Integer retailerId);
}
