package com.cashback.engine.repository;

import com.cashback.engine.domain.Retailer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RetailerRepository extends JpaRepository<Retailer, Integer> {

    List<Retailer> findByStatus(String status);

    List<Retailer> findByFeatured(Boolean featured);

    List<Retailer> findByDealOfWeek(Boolean dealOfWeek);

    List<Retailer> findByTitleContainingIgnoreCase(String title);
}
