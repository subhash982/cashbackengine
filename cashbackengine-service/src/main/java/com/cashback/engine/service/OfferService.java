package com.cashback.engine.service;

import com.cashback.engine.domain.merchant.Merchant;
import com.cashback.engine.domain.offer.Offer;
import com.cashback.engine.dto.request.OfferRequest;
import com.cashback.engine.repository.MerchantRepository;
import com.cashback.engine.repository.OfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final MerchantRepository merchantRepository;

    @Transactional(readOnly = true)
    public Page<Map<String, Object>> getActiveOffers(Pageable pageable) {
        return offerRepository.findByActiveTrue(pageable).map(this::toMap);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getOffersByMerchant(Long merchantId) {
        return offerRepository.findByMerchantIdAndActiveTrue(merchantId).stream()
                .map(this::toMap).toList();
    }

    @Transactional
    public Map<String, Object> createOffer(OfferRequest request) {
        Merchant merchant = merchantRepository.findById(request.getMerchantId())
                .orElseThrow(() -> new IllegalArgumentException("Merchant not found: " + request.getMerchantId()));

        Offer offer = Offer.builder()
                .merchant(merchant)
                .title(request.getTitle())
                .description(request.getDescription())
                .offerType(request.getOfferType())
                .cashbackPercentage(request.getCashbackPercentage())
                .category(request.getCategory())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .campaignCode(request.getCampaignCode())
                .build();

        return toMap(offerRepository.save(offer));
    }

    @Transactional
    public void deactivateOffer(Long offerId) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new IllegalArgumentException("Offer not found: " + offerId));
        offer.setActive(false);
        offerRepository.save(offer);
    }

    private Map<String, Object> toMap(Offer o) {
        return Map.of(
                "id", o.getId(),
                "merchantId", o.getMerchant().getId(),
                "merchantName", o.getMerchant().getName(),
                "title", o.getTitle(),
                "offerType", o.getOfferType().name(),
                "cashbackPercentage", o.getCashbackPercentage(),
                "active", o.isActive()
        );
    }
}
