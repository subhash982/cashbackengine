package com.cashback.engine.service;

import com.cashback.engine.domain.payout.Payout;
import com.cashback.engine.domain.payout.PayoutStatus;
import com.cashback.engine.domain.user.User;
import com.cashback.engine.dto.request.PayoutRequest;
import com.cashback.engine.repository.PayoutRepository;
import com.cashback.engine.repository.UserRepository;
import com.cashback.engine.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayoutService {

    private static final BigDecimal MINIMUM_WITHDRAWAL = new BigDecimal("10.00");

    private final PayoutRepository payoutRepository;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final WalletService walletService;
    private final NotificationService notificationService;

    @Transactional
    public Map<String, Object> requestPayout(Long userId, PayoutRequest request) {
        if (request.getAmount().compareTo(MINIMUM_WITHDRAWAL) < 0) {
            throw new IllegalArgumentException("Minimum withdrawal amount is $" + MINIMUM_WITHDRAWAL);
        }

        walletService.deductWithdrawable(userId, request.getAmount());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found: " + userId));

        Payout payout = Payout.builder()
                .user(user)
                .amount(request.getAmount())
                .payoutMethod(request.getPayoutMethod())
                .payoutDestination(request.getPayoutDestination())
                .status(PayoutStatus.REQUESTED)
                .build();

        payout = payoutRepository.save(payout);
        notificationService.sendEmail(user.getEmail(), "Payout Requested",
                "Your payout of $" + request.getAmount() + " has been requested and is being processed.");

        log.info("Payout requested: userId={}, amount={}, method={}", userId, request.getAmount(), request.getPayoutMethod());
        return toMap(payout);
    }

    @Transactional(readOnly = true)
    public Page<Map<String, Object>> getUserPayouts(Long userId, Pageable pageable) {
        return payoutRepository.findByUserId(userId, pageable).map(this::toMap);
    }

    @Transactional
    public Map<String, Object> updatePayoutStatus(Long payoutId, PayoutStatus newStatus, String externalTxId) {
        Payout payout = payoutRepository.findById(payoutId)
                .orElseThrow(() -> new IllegalArgumentException("Payout not found: " + payoutId));
        payout.setStatus(newStatus);
        payout.setExternalTransactionId(externalTxId);
        if (newStatus == PayoutStatus.COMPLETED) {
            payout.setProcessedAt(java.time.Instant.now());
        }
        return toMap(payoutRepository.save(payout));
    }

    private Map<String, Object> toMap(Payout p) {
        return Map.of(
                "id", p.getId(),
                "amount", p.getAmount(),
                "currency", p.getCurrency(),
                "payoutMethod", p.getPayoutMethod().name(),
                "status", p.getStatus().name(),
                "createdAt", p.getCreatedAt()
        );
    }
}
