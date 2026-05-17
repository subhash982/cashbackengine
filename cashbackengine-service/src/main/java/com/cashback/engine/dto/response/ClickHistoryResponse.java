package com.cashback.engine.dto.response;

import com.cashback.engine.domain.ClickHistory;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ClickHistoryResponse {

    private Integer clickId;
    private Integer retailerId;
    private String retailerTitle;
    private String retailerUrl;
    private String retailerImage;
    private String retailerCashback;
    private LocalDateTime added;

    public static ClickHistoryResponse from(ClickHistory c) {
        return ClickHistoryResponse.builder()
                .clickId(c.getClickId())
                .retailerId(c.getRetailer().getRetailerId())
                .retailerTitle(c.getRetailer().getTitle())
                .retailerUrl(c.getRetailer().getUrl())
                .retailerImage(c.getRetailer().getImage())
                .retailerCashback(c.getRetailer().getCashback())
                .added(c.getAdded())
                .build();
    }
}
