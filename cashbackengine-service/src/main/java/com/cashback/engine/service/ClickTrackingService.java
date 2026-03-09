package com.cashback.engine.service;

import com.cashback.engine.domain.click.Click;
import com.cashback.engine.domain.merchant.Merchant;
import com.cashback.engine.domain.user.User;
import com.cashback.engine.repository.ClickRepository;
import com.cashback.engine.repository.MerchantRepository;
import com.cashback.engine.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClickTrackingService {

    private final ClickRepository clickRepository;
    private final UserRepository userRepository;
    private final MerchantRepository merchantRepository;
    private final FraudDetectionService fraudDetectionService;

    @Transactional
    public Click trackClick(Long userId, Long merchantId, HttpServletRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new IllegalArgumentException("Merchant not found: " + merchantId));

        String ipAddress = extractIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        String sessionId = request.getSession(true).getId();
        String referrer = request.getHeader("Referer");

        boolean fraudulent = fraudDetectionService.isFraudulentClick(userId, merchant, ipAddress, userAgent);

        Click click = Click.builder()
                .user(user)
                .merchant(merchant)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .device(parseDevice(userAgent))
                .sessionId(sessionId)
                .referrer(referrer)
                .fraudSuspected(fraudulent)
                .build();

        click = clickRepository.save(click);
        log.info("Click tracked: clickId={}, userId={}, merchantId={}, fraud={}",
                 click.getClickId(), userId, merchantId, fraudulent);
        return click;
    }

    private String extractIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String parseDevice(String userAgent) {
        if (userAgent == null) return "unknown";
        String ua = userAgent.toLowerCase();
        if (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone")) return "mobile";
        if (ua.contains("tablet") || ua.contains("ipad")) return "tablet";
        return "desktop";
    }
}
