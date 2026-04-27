package com.cashback.engine.repository;

import com.cashback.engine.domain.ClickHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClickHistoryRepository extends JpaRepository<ClickHistory, Integer> {

    List<ClickHistory> findByUserUserId(Integer userId);

    List<ClickHistory> findByRetailerRetailerId(Integer retailerId);
}
