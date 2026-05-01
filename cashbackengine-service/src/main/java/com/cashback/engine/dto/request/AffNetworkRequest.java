package com.cashback.engine.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AffNetworkRequest {

    @NotBlank
    private String networkName;

    @NotBlank
    private String website;

    private String image = "";

    private String csvFormat = "";

    private String confirmeds = "";

    private String pendings = "";

    private String declineds = "";

    private String status = "active";
}
