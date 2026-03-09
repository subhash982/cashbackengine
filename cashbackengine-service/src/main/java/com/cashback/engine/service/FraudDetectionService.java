package com.cashback.engine.service;

import com.cashback.engine.domain.click.Click;
import com.cashback.engine.domain.merchant.Merchant;
import com.cashback.engine.repository.ClickRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class FraudDetectionService {

    private static final int MAX_CLICKS_PER_MINUTE = 10;
    private static final int MAX_CLICKS_PER_IP_PER_MINUTE = 20;

    private final ClickRepository clickRepository;

    public boolean isFraudulentClick(Long userId, Merchant merchant, String ipAddress, String userAgent) {
        // Self-referral check: if the user owns this merchant
        if (merchant.getAffiliateNetworkMerchantId() != null &&
                merchant.getAffiliateNetworkMerchantId().equals(String.valueOf(userId))) {
            log.warn("Self-referral detected: userId={}, merchantId={}", userId, merchant.getId());
            return true;
        }

        // Rate limit: too many clicks per minute from same user
        Instant oneMinuteAgo = Instant.now().minus(1, ChronoUnit.MINUTES);
        long userClickCount = clickRepository.countClicksByUserSince(userId, oneMinuteAgo);
        if (userClickCount >= MAX_CLICKS_PER_MINUTE) {
            log.warn("Rate limit exceeded: userId={} has {} clicks in last minute", userId, userClickCount);
            return true;
        }

        // IP-based rate limiting
        if (ipAddress != null) {
            long ipClickCount = clickRepository.countClicksByIpSince(ipAddress, oneMinuteAgo);
            if (ipClickCount >= MAX_CLICKS_PER_IP_PER_MINUTE) {
                log.warn("IP rate limit exceeded: ip={} has {} clicks in last minute", ipAddress, ipClickCount);
                return true;
            }
        }

        // Bot detection: missing or suspicious user agent
        if (userAgent == null || userAgent.isBlank() || isBotUserAgent(userAgent)) {
            log.warn("Bot-like request detected: userId={}, userAgent={}", userId, userAgent);
            return true;
        }

        return false;
    }

    public boolean isFraudulentTransaction(Click click, String transactionId) {
        // Duplicate transaction check would use transaction repo in full implementation
        return false;
    }

    private boolean isBotUserAgent(String userAgent) {
        String ua = userAgent.toLowerCase();
        return ua.contains("bot") || ua.contains("crawler") || ua.contains("spider") ||
               ua.contains("curl") || ua.contains("wget") || ua.contains("python-requests");
    }
}
