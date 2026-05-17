package com.cashback.engine.repository;

import com.cashback.engine.domain.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Integer> {

    List<Coupon> findByRetailerId(Integer retailerId);

    Page<Coupon> findByStatus(String status, Pageable pageable);

    List<Coupon> findByStatusOrderByCouponIdDesc(String status);

    @org.springframework.data.jpa.repository.Query(
        "SELECT c FROM Coupon c WHERE c.status = 'active' AND (c.endDate IS NULL OR c.endDate > :now) ORDER BY c.couponId DESC"
    )
    List<Coupon> findActiveNotExpired(@org.springframework.data.repository.query.Param("now") java.time.LocalDateTime now);

    @org.springframework.data.jpa.repository.Query(
        "SELECT c FROM Coupon c WHERE c.retailerId = :retailerId AND c.status = 'active' AND (c.endDate IS NULL OR c.endDate > :now) ORDER BY c.couponId DESC"
    )
    List<Coupon> findActiveNotExpiredByRetailer(
        @org.springframework.data.repository.query.Param("now") java.time.LocalDateTime now,
        @org.springframework.data.repository.query.Param("retailerId") Integer retailerId
    );

    @org.springframework.data.jpa.repository.Query(
        "SELECT COUNT(c) FROM Coupon c WHERE c.retailerId = :retailerId AND c.status = 'active' AND (c.endDate IS NULL OR c.endDate > :now)"
    )
    long countActiveByRetailerId(
        @org.springframework.data.repository.query.Param("retailerId") Integer retailerId,
        @org.springframework.data.repository.query.Param("now") java.time.LocalDateTime now
    );
}
