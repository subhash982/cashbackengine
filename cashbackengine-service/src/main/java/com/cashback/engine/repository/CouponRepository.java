package com.cashback.engine.repository;

import com.cashback.engine.domain.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Integer> {

    List<Coupon> findByRetailerRetailerId(Integer retailerId);

    List<Coupon> findByStatus(String status);
}
