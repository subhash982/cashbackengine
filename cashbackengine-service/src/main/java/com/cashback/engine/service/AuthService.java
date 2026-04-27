package com.cashback.engine.service;

import com.cashback.engine.domain.User;
import com.cashback.engine.dto.request.LoginRequest;
import com.cashback.engine.dto.request.RegisterRequest;
import com.cashback.engine.dto.response.AuthResponse;
import com.cashback.engine.repository.UserRepository;
import com.cashback.engine.security.JwtTokenProvider;
import com.cashback.engine.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken: " + request.getUsername());
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fname(request.getFname())
                .lname(request.getLname())
                .phone(request.getPhone())
                .address(request.getAddress())
                .address2(request.getAddress2())
                .city(request.getCity())
                .state(request.getState())
                .zip(request.getZip())
                .role("USER")
                .status("active")
                .build();
        user = userRepository.save(user);

        String token = tokenProvider.generateTokenFromEmail(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getUserId())
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String token = tokenProvider.generateToken(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getUserId())
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole())
                .build();
    }
}
