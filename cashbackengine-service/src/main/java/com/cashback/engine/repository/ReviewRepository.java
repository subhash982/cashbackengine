package com.cashback.engine.repository;

import com.cashback.engine.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    @Query("SELECT r FROM Review r JOIN FETCH r.retailer JOIN FETCH r.user WHERE r.retailer.retailerId = :retailerId ORDER BY r.added DESC")
    List<Review> findByRetailerRetailerId(@Param("retailerId") Integer retailerId);

    @Query("SELECT r FROM Review r JOIN FETCH r.retailer JOIN FETCH r.user ORDER BY r.added DESC")
    List<Review> findAllWithAssociations();

    boolean existsByRetailerRetailerIdAndUserUserId(Integer retailerId, Integer userId);

    List<Review> findByUserUserId(Integer userId);

    List<Review> findByStatus(String status);
}
