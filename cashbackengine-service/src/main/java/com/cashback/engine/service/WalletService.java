package com.cashback.engine.service;

import com.cashback.engine.domain.transaction.Transaction;
import com.cashback.engine.domain.transaction.TransactionStatus;
import com.cashback.engine.domain.wallet.Wallet;
import com.cashback.engine.dto.response.WalletResponse;
import com.cashback.engine.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class WalletService {

    private final WalletRepository walletRepository;

    @Transactional(readOnly = true)
    public WalletResponse getWallet(Long userId) {
        Wallet wallet = getOrCreateWallet(userId);
        return WalletResponse.from(wallet);
    }

    @Transactional
    public void applyTransactionStatusChange(Transaction transaction, TransactionStatus newStatus) {
        Wallet wallet = getOrCreateWallet(transaction.getUser().getId());
        BigDecimal cashback = transaction.getCashbackAmount();

        switch (newStatus) {
            case PENDING -> {
                // Move cashback from nothing to pending
                wallet.setPendingAmount(wallet.getPendingAmount().add(cashback));
            }
            case CONFIRMED -> {
                // Move from pending to confirmed
                wallet.setPendingAmount(wallet.getPendingAmount().subtract(cashback));
                wallet.setConfirmedAmount(wallet.getConfirmedAmount().add(cashback));
            }
            case PAYABLE -> {
                // Move from confirmed to withdrawable
                wallet.setConfirmedAmount(wallet.getConfirmedAmount().subtract(cashback));
                wallet.setWithdrawableAmount(wallet.getWithdrawableAmount().add(cashback));
            }
            case PAID -> {
                // Move from withdrawable to paid
                wallet.setWithdrawableAmount(wallet.getWithdrawableAmount().subtract(cashback));
                wallet.setTotalPaidAmount(wallet.getTotalPaidAmount().add(cashback));
            }
            case CANCELLED, REJECTED -> {
                // Return from pending
                if (transaction.getStatus() == TransactionStatus.PENDING) {
                    wallet.setPendingAmount(wallet.getPendingAmount().subtract(cashback));
                } else if (transaction.getStatus() == TransactionStatus.CONFIRMED) {
                    wallet.setConfirmedAmount(wallet.getConfirmedAmount().subtract(cashback));
                }
            }
        }

        walletRepository.save(wallet);
        log.info("Wallet updated for userId={}: status={}, cashback={}", transaction.getUser().getId(), newStatus, cashback);
    }

    @Transactional
    public void deductWithdrawable(Long userId, BigDecimal amount) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Wallet not found for userId=" + userId));
        if (wallet.getWithdrawableAmount().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient withdrawable balance");
        }
        wallet.setWithdrawableAmount(wallet.getWithdrawableAmount().subtract(amount));
        walletRepository.save(wallet);
    }

    private Wallet getOrCreateWallet(Long userId) {
        return walletRepository.findByUserId(userId).orElseGet(() -> {
            Wallet w = new Wallet();
            w.setUser(null); // caller must ensure user exists
            return w;
        });
    }
}
