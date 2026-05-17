package com.cashback.engine.service;

import com.cashback.engine.domain.Coupon;
import com.cashback.engine.domain.Retailer;
import com.cashback.engine.dto.request.CouponRequest;
import com.cashback.engine.dto.response.CouponWithRetailerResponse;
import com.cashback.engine.repository.CouponRepository;
import com.cashback.engine.repository.RetailerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final RetailerRepository retailerRepository;

    @Transactional(readOnly = true)
    public List<CouponWithRetailerResponse> getActiveCoupons() {
        List<Coupon> coupons = couponRepository.findActiveNotExpired(java.time.LocalDateTime.now());
        List<Integer> retailerIds = coupons.stream()
                .map(Coupon::getRetailerId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());
        Map<Integer, Retailer> retailerMap = retailerRepository.findAllById(retailerIds)
                .stream()
                .collect(Collectors.toMap(Retailer::getRetailerId, r -> r));
        return coupons.stream()
                .map(c -> CouponWithRetailerResponse.from(c, retailerMap.get(c.getRetailerId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<Coupon> getAll(int page, int size, String status) {
        PageRequest pr = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "couponId"));
        if (status != null && !status.equals("all")) {
            return couponRepository.findByStatus(status, pr);
        }
        return couponRepository.findAll(pr);
    }

    @Transactional(readOnly = true)
    public List<CouponWithRetailerResponse> getActiveByRetailer(Integer retailerId) {
        List<Coupon> coupons = couponRepository.findActiveNotExpiredByRetailer(
                java.time.LocalDateTime.now(), retailerId);
        Retailer retailer = retailerRepository.findById(retailerId).orElse(null);
        return coupons.stream()
                .map(c -> CouponWithRetailerResponse.from(c, retailer))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Coupon> getByRetailer(Integer retailerId) {
        return couponRepository.findByRetailerId(retailerId);
    }

    @Transactional(readOnly = true)
    public Coupon getById(Integer id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found: " + id));
    }

    @Transactional
    public Coupon create(CouponRequest request) {
        Coupon coupon = new Coupon();
        applyRequest(coupon, request);
        return couponRepository.save(coupon);
    }

    @Transactional
    public Coupon update(Integer id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found: " + id));
        applyRequest(coupon, request);
        return couponRepository.save(coupon);
    }

    @Transactional
    public void delete(Integer id) {
        if (!couponRepository.existsById(id)) {
            throw new IllegalArgumentException("Coupon not found: " + id);
        }
        couponRepository.deleteById(id);
    }

    private void applyRequest(Coupon coupon, CouponRequest request) {
        coupon.setTitle(request.getTitle());
        coupon.setRetailerId(request.getRetailerId());
        coupon.setPromoId(request.getPromoId() != null ? request.getPromoId() : "");
        coupon.setCouponType(request.getCouponType() != null ? request.getCouponType() : "Coupon");
        coupon.setCode(request.getCode() != null ? request.getCode() : "");
        coupon.setLink(request.getLink() != null ? request.getLink() : "");
        coupon.setDescription(request.getDescription() != null ? request.getDescription() : "");
        coupon.setStartDate(request.getStartDate());
        coupon.setEndDate(request.getEndDate());
        coupon.setExclusive(request.getExclusive() != null ? request.getExclusive() : 0);
        coupon.setSpecial(request.getSpecial() != null ? request.getSpecial() : 0);
        coupon.setOffer(request.getOffer());
        coupon.setOfferImg(request.getOfferImg());
        coupon.setBannerImg(request.getBannerImg());
        coupon.setOfferTemplate(request.getOfferTemplate());
        coupon.setStatus(request.getStatus() != null ? request.getStatus() : "active");
    }
}
