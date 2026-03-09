package com.cashback.engine.repository;

import com.cashback.engine.domain.transaction.Transaction;
import com.cashback.engine.domain.transaction.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByTransactionId(String transactionId);

    Page<Transaction> findByUserId(Long userId, Pageable pageable);

    Page<Transaction> findByUserIdAndStatus(Long userId, TransactionStatus status, Pageable pageable);

    List<Transaction> findByStatus(TransactionStatus status);

    @Query("SELECT SUM(t.cashbackAmount) FROM Transaction t WHERE t.user.id = :userId AND t.status = :status")
    Optional<BigDecimal> sumCashbackByUserAndStatus(@Param("userId") Long userId, @Param("status") TransactionStatus status);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.createdAt >= :since")
    long countTransactionsSince(@Param("since") Instant since);

    @Query("SELECT SUM(t.orderValue) FROM Transaction t WHERE t.createdAt >= :since AND t.status NOT IN ('CANCELLED', 'REJECTED')")
    Optional<BigDecimal> sumOrderValueSince(@Param("since") Instant since);
}
