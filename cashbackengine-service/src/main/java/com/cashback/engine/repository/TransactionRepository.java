package com.cashback.engine.repository;

import com.cashback.engine.domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    List<Transaction> findByUserUserId(Integer userId);

    List<Transaction> findByStatus(String status);

    long countByStatus(String status);
}
