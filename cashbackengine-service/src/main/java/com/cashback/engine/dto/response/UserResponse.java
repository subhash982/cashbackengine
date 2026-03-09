package com.cashback.engine.dto.response;

import com.cashback.engine.domain.user.User;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private BigDecimal walletBalance;
    private String phoneNumber;
    private String country;
    private boolean emailVerified;
    private Instant createdAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .walletBalance(user.getWalletBalance())
                .phoneNumber(user.getPhoneNumber())
                .country(user.getCountry())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
