package com.cashback.engine.repository;

import com.cashback.engine.domain.RetailerToCategory;
import com.cashback.engine.domain.RetailerToCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RetailerToCategoryRepository extends JpaRepository<RetailerToCategory, RetailerToCategoryId> {

    List<RetailerToCategory> findByRetailerRetailerId(Integer retailerId);

    List<RetailerToCategory> findByCategoryCategoryId(Integer categoryId);
}
