package com.cashback.engine.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContentRequest {

    @NotBlank
    @Size(max = 50)
    private String name;

    @Size(max = 50)
    private String language = "english";

    @Size(max = 100)
    private String linkTitle = "";

    @Size(max = 255)
    private String title = "";

    private String description = "";

    @Size(max = 10)
    private String pageLocation = "";

    @Size(max = 255)
    private String pageUrl = "";

    @Size(max = 255)
    private String metaDescription = "";

    @Size(max = 255)
    private String metaKeywords = "";

    @Size(max = 20)
    private String status = "active";
}
