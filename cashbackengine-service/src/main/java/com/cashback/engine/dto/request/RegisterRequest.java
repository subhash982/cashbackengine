package com.cashback.engine.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    @Size(max = 70)
    private String username;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    @NotBlank
    @Size(min = 8, max = 100)
    private String password;

    @Size(max = 32)
    private String fname;

    @Size(max = 25)
    private String lname;

    @Size(max = 20)
    private String phone;

    @Size(max = 32)
    private String address;

    @Size(max = 70)
    private String address2;

    @Size(max = 50)
    private String city;

    @Size(max = 50)
    private String state;

    @Size(max = 10)
    private String zip;
}
