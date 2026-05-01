package com.cashback.engine.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank
    @Size(max = 50)
    private String name;

    private Integer parentId;

    private String description;

    @Size(max = 100)
    private String categoryUrl;

    @Size(max = 20)
    private String status = "active";

    @Size(max = 512)
    private String alias = "";
}
