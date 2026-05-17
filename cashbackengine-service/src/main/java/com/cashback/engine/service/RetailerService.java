package com.cashback.engine.service;

import com.cashback.engine.domain.AffNetwork;
import com.cashback.engine.domain.Retailer;
import com.cashback.engine.dto.request.RetailerRequest;
import com.cashback.engine.dto.response.RetailerResponse;
import com.cashback.engine.repository.AffNetworkRepository;
import com.cashback.engine.repository.RetailerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RetailerService {

    private final RetailerRepository retailerRepository;
    private final AffNetworkRepository affNetworkRepository;

    @Transactional(readOnly = true)
    public List<RetailerResponse> getAllRetailers() {
        return retailerRepository.findByStatusOrderByVisitsDesc("active", PageRequest.of(0, 30))
                .stream()
                .map(RetailerResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RetailerResponse> getAllActiveRetailers() {
        return retailerRepository.findByStatus("active")
                .stream()
                .sorted((a, b) -> Integer.compare(b.getVisits(), a.getVisits()))
                .map(RetailerResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RetailerResponse getRetailerById(Integer id) {
        Retailer retailer = retailerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Retailer not found: " + id));
        return RetailerResponse.from(retailer);
    }

    @Transactional(readOnly = true)
    public List<RetailerResponse> getFeaturedRetailers() {
        return retailerRepository.findByFeatured(true)
                .stream()
                .map(RetailerResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RetailerResponse> searchRetailers(String query) {
        return retailerRepository.findByTitleContainingIgnoreCase(query)
                .stream()
                .map(RetailerResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public RetailerResponse createRetailer(RetailerRequest request) {
        Retailer retailer = buildRetailer(new Retailer(), request);
        return RetailerResponse.from(retailerRepository.save(retailer));
    }

    @Transactional
    public RetailerResponse updateRetailer(Integer id, RetailerRequest request) {
        Retailer retailer = retailerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Retailer not found: " + id));
        buildRetailer(retailer, request);
        return RetailerResponse.from(retailerRepository.save(retailer));
    }

    @Transactional
    public void deleteRetailer(Integer id) {
        if (!retailerRepository.existsById(id)) {
            throw new IllegalArgumentException("Retailer not found: " + id);
        }
        retailerRepository.deleteById(id);
    }

    private Retailer buildRetailer(Retailer retailer, RetailerRequest request) {
        retailer.setTitle(request.getTitle());
        retailer.setProgramId(request.getProgramId());
        retailer.setUrl(request.getUrl());
        retailer.setImage(request.getImage());
        retailer.setCashback(request.getCashback());
        retailer.setOldCashback(request.getOldCashback());
        retailer.setConditions(request.getConditions());
        retailer.setDescription(request.getDescription());
        retailer.setStatus(request.getStatus() != null ? request.getStatus() : "active");
        retailer.setFeatured(request.getFeatured() != null && request.getFeatured());
        retailer.setDealOfWeek(request.getDealOfWeek() != null && request.getDealOfWeek());

        if (request.getNetworkId() != null) {
            AffNetwork network = affNetworkRepository.findById(request.getNetworkId())
                    .orElseThrow(() -> new IllegalArgumentException("AffNetwork not found: " + request.getNetworkId()));
            retailer.setNetwork(network);
        }
        return retailer;
    }
}
