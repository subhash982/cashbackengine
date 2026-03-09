package com.cashback.engine.repository;

import com.cashback.engine.domain.payout.Payout;
import com.cashback.engine.domain.payout.PayoutStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayoutRepository extends JpaRepository<Payout, Long> {

    Page<Payout> findByUserId(Long userId, Pageable pageable);

    List<Payout> findByStatus(PayoutStatus status);

    @Query("SELECT SUM(p.amount) FROM Payout p WHERE p.user.id = :userId AND p.status = 'COMPLETED'")
    Optional<BigDecimal> sumCompletedPayoutsByUser(@Param("userId") Long userId);
}
