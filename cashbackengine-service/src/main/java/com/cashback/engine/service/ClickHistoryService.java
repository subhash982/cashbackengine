package com.cashback.engine.service;

import com.cashback.engine.domain.ClickHistory;
import com.cashback.engine.domain.Retailer;
import com.cashback.engine.domain.User;
import com.cashback.engine.dto.response.ClickHistoryResponse;
import com.cashback.engine.repository.ClickHistoryRepository;
import com.cashback.engine.repository.RetailerRepository;
import com.cashback.engine.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClickHistoryService {

    private final ClickHistoryRepository clickHistoryRepository;
    private final UserRepository userRepository;
    private final RetailerRepository retailerRepository;

    @Transactional
    public void logClick(Integer userId, Integer retailerId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Retailer retailer = retailerRepository.findById(retailerId)
                .orElseThrow(() -> new IllegalArgumentException("Retailer not found: " + retailerId));

        clickHistoryRepository.save(ClickHistory.builder()
                .user(user)
                .retailer(retailer)
                .build());
    }

    @Transactional(readOnly = true)
    public List<ClickHistoryResponse> getMyHistory(Integer userId) {
        return clickHistoryRepository.findByUserUserId(userId)
                .stream()
                .sorted(Comparator.comparing(ClickHistory::getAdded).reversed())
                .map(ClickHistoryResponse::from)
                .collect(Collectors.toList());
    }
}
