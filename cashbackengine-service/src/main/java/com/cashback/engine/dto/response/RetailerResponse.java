package com.cashback.engine.dto.response;

import com.cashback.engine.domain.Retailer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RetailerResponse {
    private Integer retailerId;
    private String title;
    private Integer networkId;
    private String programId;
    private String url;
    private String image;
    private String cashback;
    private String oldCashback;
    private String conditions;
    private String description;
    private String retailerUrl;
    private String metaDescription;
    private String metaKeywords;
    private LocalDateTime endDate;
    private boolean featured;
    private boolean dealOfWeek;
    private Integer visits;
    private String status;
    private LocalDateTime added;

    public static RetailerResponse from(Retailer r) {
        return RetailerResponse.builder()
                .retailerId(r.getRetailerId())
                .title(r.getTitle())
                .networkId(r.getNetwork() != null ? r.getNetwork().getNetworkId() : null)
                .programId(r.getProgramId())
                .url(r.getUrl())
                .image(r.getImage())
                .cashback(r.getCashback())
                .oldCashback(r.getOldCashback())
                .conditions(r.getConditions())
                .description(r.getDescription())
                .retailerUrl(r.getRetailerUrl())
                .metaDescription(r.getMetaDescription())
                .metaKeywords(r.getMetaKeywords())
                .endDate(r.getEndDate())
                .featured(Boolean.TRUE.equals(r.getFeatured()))
                .dealOfWeek(Boolean.TRUE.equals(r.getDealOfWeek()))
                .visits(r.getVisits())
                .status(r.getStatus())
                .added(r.getAdded())
                .build();
    }
}
