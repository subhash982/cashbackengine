package com.cashback.engine.service;

import com.cashback.engine.repository.ClickHistoryRepository;
import com.cashback.engine.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final ClickHistoryRepository clickHistoryRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getUserStats(Integer userId) {
        var transactions = transactionRepository.findByUserUserId(userId);

        BigDecimal totalEarned = transactions.stream()
                .filter(t -> "confirmed".equals(t.getStatus()) || "paid".equals(t.getStatus()))
                .map(t -> t.getAmount() != null ? t.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pending = transactions.stream()
                .filter(t -> "pending".equals(t.getStatus()))
                .map(t -> t.getAmount() != null ? t.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal paid = transactions.stream()
                .filter(t -> "paid".equals(t.getStatus()))
                .map(t -> t.getAmount() != null ? t.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long clickCount = clickHistoryRepository.findByUserUserId(userId).size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCashbackEarned", totalEarned);
        stats.put("pendingCashback", pending);
        stats.put("paidCashback", paid);
        stats.put("totalClicks", clickCount);
        stats.put("totalTransactions", transactions.size());
        return stats;
    }
}
