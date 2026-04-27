package com.cashback.engine.repository;

import com.cashback.engine.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    List<Review> findByRetailerRetailerId(Integer retailerId);

    List<Review> findByUserUserId(Integer userId);

    List<Review> findByStatus(String status);
}
