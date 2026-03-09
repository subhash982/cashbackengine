package com.cashback.engine.controller;

import com.cashback.engine.domain.click.Click;
import com.cashback.engine.security.UserPrincipal;
import com.cashback.engine.service.ClickTrackingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/clicks")
@RequiredArgsConstructor
@Slf4j
public class ClickController {

    private final ClickTrackingService clickTrackingService;

    /**
     * Track a click and redirect to the merchant's affiliate URL.
     * This endpoint is public (users may not be authenticated when clicking).
     */
    @GetMapping("/track")
    public void trackAndRedirect(
            @RequestParam Long userId,
            @RequestParam Long merchantId,
            HttpServletRequest request,
            HttpServletResponse response) throws IOException {

        Click click = clickTrackingService.trackClick(userId, merchantId, request);
        String redirectUrl = click.getMerchant().getAffiliateTrackingUrl();

        if (redirectUrl == null || redirectUrl.isBlank()) {
            redirectUrl = click.getMerchant().getWebsiteUrl();
        }
        // Append clickId as a sub-id for affiliate network tracking
        redirectUrl += (redirectUrl.contains("?") ? "&" : "?") + "subid=" + click.getClickId();

        response.sendRedirect(redirectUrl);
    }
}
