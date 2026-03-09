package com.cashback.engine.service;

import com.cashback.engine.domain.click.Click;
import com.cashback.engine.domain.transaction.Transaction;
import com.cashback.engine.domain.transaction.TransactionStatus;
import com.cashback.engine.dto.request.ConversionWebhookRequest;
import com.cashback.engine.dto.response.TransactionResponse;
import com.cashback.engine.repository.ClickRepository;
import com.cashback.engine.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final ClickRepository clickRepository;
    private final CashbackCalculationService cashbackCalculationService;
    private final WalletService walletService;
    private final NotificationService notificationService;

    @Transactional
    public Transaction processConversion(ConversionWebhookRequest request) {
        // Check for duplicate transaction
        if (transactionRepository.findByTransactionId(request.getTransactionId()).isPresent()) {
            throw new IllegalArgumentException("Duplicate transaction: " + request.getTransactionId());
        }

        // Match click
        Click click = clickRepository.findByClickId(request.getClickId())
                .orElseThrow(() -> new IllegalArgumentException("Click not found: " + request.getClickId()));

        BigDecimal cashback = cashbackCalculationService.calculate(click.getMerchant(), request.getCommission());

        Transaction transaction = Transaction.builder()
                .transactionId(request.getTransactionId())
                .click(click)
                .user(click.getUser())
                .merchant(click.getMerchant())
                .orderValue(request.getOrderValue())
                .commission(request.getCommission())
                .cashbackAmount(cashback)
                .currency(request.getCurrency())
                .affiliateNetwork(request.getAffiliateNetwork())
                .networkTransactionId(request.getNetworkTransactionId())
                .status(TransactionStatus.PENDING)
                .fraudSuspected(click.isFraudSuspected())
                .build();

        transaction = transactionRepository.save(transaction);
        walletService.applyTransactionStatusChange(transaction, TransactionStatus.PENDING);
        notifyAsync(transaction, "tracked");

        log.info("Conversion processed: txId={}, cashback={}", transaction.getTransactionId(), cashback);
        return transaction;
    }

    @Transactional
    public TransactionResponse updateStatus(Long transactionId, TransactionStatus newStatus) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + transactionId));

        TransactionStatus old = transaction.getStatus();
        transaction.setStatus(newStatus);

        if (newStatus == TransactionStatus.CONFIRMED) {
            transaction.setConfirmedAt(Instant.now());
        } else if (newStatus == TransactionStatus.PAID) {
            transaction.setPaidAt(Instant.now());
        }

        transaction = transactionRepository.save(transaction);
        walletService.applyTransactionStatusChange(transaction, newStatus);
        notifyAsync(transaction, newStatus.name().toLowerCase());

        log.info("Transaction status changed: id={}, {} -> {}", transactionId, old, newStatus);
        return TransactionResponse.from(transaction);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getUserTransactions(Long userId, Pageable pageable) {
        return transactionRepository.findByUserId(userId, pageable)
                .map(TransactionResponse::from);
    }

    @Async
    protected void notifyAsync(Transaction transaction, String event) {
        try {
            notificationService.notifyCashbackEvent(transaction.getUser(), event, transaction.getCashbackAmount());
        } catch (Exception e) {
            log.warn("Failed to send notification for transaction {}: {}", transaction.getId(), e.getMessage());
        }
    }
}
