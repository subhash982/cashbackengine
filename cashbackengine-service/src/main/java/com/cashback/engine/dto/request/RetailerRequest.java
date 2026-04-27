package com.cashback.engine.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RetailerRequest {

    @NotBlank
    @Size(max = 255)
    private String title;

    private Integer networkId;

    @Size(max = 255)
    private String programId;

    @NotBlank
    @Size(max = 255)
    private String url;

    @Size(max = 255)
    private String image;

    @Size(max = 20)
    private String cashback;

    @Size(max = 20)
    private String oldCashback;

    private String conditions;

    private String description;

    @Size(max = 20)
    private String status = "active";

    private Boolean featured = false;

    private Boolean dealOfWeek = false;
}
