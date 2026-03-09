package com.cashback.engine.service;

import com.cashback.engine.domain.merchant.Merchant;
import com.cashback.engine.dto.request.MerchantRequest;
import com.cashback.engine.dto.response.MerchantResponse;
import com.cashback.engine.repository.MerchantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MerchantService {

    private final MerchantRepository merchantRepository;

    @Transactional(readOnly = true)
    public Page<MerchantResponse> getActiveMerchants(Pageable pageable) {
        return merchantRepository.findByActiveTrue(pageable).map(MerchantResponse::from);
    }

    @Transactional(readOnly = true)
    public MerchantResponse getMerchant(Long id) {
        return merchantRepository.findById(id)
                .map(MerchantResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Merchant not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<MerchantResponse> getMerchantsByCategory(String category) {
        return merchantRepository.findByCategoryAndActiveTrue(category).stream()
                .map(MerchantResponse::from).toList();
    }

    @Transactional
    public MerchantResponse createMerchant(MerchantRequest request) {
        Merchant merchant = Merchant.builder()
                .name(request.getName())
                .description(request.getDescription())
                .websiteUrl(request.getWebsiteUrl())
                .affiliateTrackingUrl(request.getAffiliateTrackingUrl())
                .logoUrl(request.getLogoUrl())
                .category(request.getCategory())
                .affiliateNetwork(request.getAffiliateNetwork())
                .affiliateNetworkMerchantId(request.getAffiliateNetworkMerchantId())
                .defaultCommissionRate(request.getDefaultCommissionRate())
                .userSharePercentage(request.getUserSharePercentage())
                .build();
        return MerchantResponse.from(merchantRepository.save(merchant));
    }

    @Transactional
    public MerchantResponse updateMerchant(Long id, MerchantRequest request) {
        Merchant merchant = merchantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Merchant not found: " + id));
        merchant.setName(request.getName());
        merchant.setDescription(request.getDescription());
        merchant.setWebsiteUrl(request.getWebsiteUrl());
        merchant.setAffiliateTrackingUrl(request.getAffiliateTrackingUrl());
        merchant.setLogoUrl(request.getLogoUrl());
        merchant.setCategory(request.getCategory());
        merchant.setDefaultCommissionRate(request.getDefaultCommissionRate());
        merchant.setUserSharePercentage(request.getUserSharePercentage());
        return MerchantResponse.from(merchantRepository.save(merchant));
    }

    @Transactional
    public void deactivateMerchant(Long id) {
        Merchant merchant = merchantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Merchant not found: " + id));
        merchant.setActive(false);
        merchantRepository.save(merchant);
    }
}
