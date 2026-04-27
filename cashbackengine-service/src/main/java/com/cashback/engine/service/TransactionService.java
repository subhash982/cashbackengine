package com.cashback.engine.service;

import com.cashback.engine.domain.Transaction;
import com.cashback.engine.domain.User;
import com.cashback.engine.dto.response.TransactionResponse;
import com.cashback.engine.repository.TransactionRepository;
import com.cashback.engine.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TransactionResponse> getUserTransactions(Integer userId) {
        return transactionRepository.findByUserUserId(userId)
                .stream()
                .map(TransactionResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll()
                .stream()
                .map(TransactionResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public TransactionResponse updateTransactionStatus(Integer id, String status) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + id));
        transaction.setStatus(status);
        return TransactionResponse.from(transactionRepository.save(transaction));
    }
}
