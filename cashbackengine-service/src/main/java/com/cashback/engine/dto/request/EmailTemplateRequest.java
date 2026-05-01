package com.cashback.engine.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EmailTemplateRequest {

    @NotBlank
    @Size(max = 50)
    private String emailName;

    @Size(max = 50)
    private String language = "english";

    @NotBlank
    @Size(max = 255)
    private String emailSubject;

    private String emailMessage = "";
}
