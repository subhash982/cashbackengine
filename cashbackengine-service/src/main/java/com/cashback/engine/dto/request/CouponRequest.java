package com.cashback.engine.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CouponRequest {

    @NotBlank
    @Size(max = 255)
    private String title;

    private Integer retailerId;

    @Size(max = 16)
    private String promoId = "";

    @Size(max = 20)
    private String couponType = "Coupon";

    @Size(max = 255)
    private String code = "";

    private String link = "";

    private String description = "";

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Integer exclusive = 0;

    private Integer special = 0;

    @Size(max = 20)
    private String offer;

    @Size(max = 256)
    private String offerImg;

    @Size(max = 256)
    private String bannerImg;

    @Size(max = 32)
    private String offerTemplate;

    @Size(max = 20)
    private String status = "active";
}
