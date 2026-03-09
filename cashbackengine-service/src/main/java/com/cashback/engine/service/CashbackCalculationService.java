package com.cashback.engine.service;

import com.cashback.engine.domain.merchant.Merchant;
import com.cashback.engine.domain.offer.Offer;
import com.cashback.engine.repository.OfferRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CashbackCalculationService {

    private final OfferRepository offerRepository;

    /**
     * Cashback = Commission × User Share Percentage
     * Checks for active promotional offers that may boost the rate.
     */
    public BigDecimal calculate(Merchant merchant, BigDecimal commission) {
        BigDecimal userSharePercentage = getEffectiveUserSharePercentage(merchant);
        BigDecimal cashback = commission.multiply(userSharePercentage)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        log.debug("Cashback calculated: commission={}, userShare={}%, cashback={}",
                  commission, userSharePercentage, cashback);
        return cashback;
    }

    private BigDecimal getEffectiveUserSharePercentage(Merchant merchant) {
        List<Offer> activeOffers = offerRepository.findActiveOffersByMerchant(merchant.getId(), Instant.now());

        // Find the best active boosted offer
        return activeOffers.stream()
                .filter(o -> o.getCashbackPercentage() != null)
                .map(Offer::getCashbackPercentage)
                .max(BigDecimal::compareTo)
                .orElse(merchant.getUserSharePercentage());
    }
}
