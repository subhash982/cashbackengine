package com.cashback.engine.dto.response;

import com.cashback.engine.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Integer userId;
    private String username;
    private String email;
    private String fname;
    private String lname;
    private String role;
    private String status;
    private LocalDateTime created;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fname(user.getFname())
                .lname(user.getLname())
                .role(user.getRole())
                .status(user.getStatus())
                .created(user.getCreated())
                .build();
    }
}
