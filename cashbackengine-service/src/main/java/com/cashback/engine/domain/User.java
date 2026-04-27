package com.cashback.engine.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "cashbackengine_users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "username", nullable = false, unique = true, length = 70)
    private String username;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "fname", length = 32)
    private String fname;

    @Column(name = "lname", length = 25)
    private String lname;

    @Column(name = "address", length = 32)
    private String address;

    @Column(name = "address2", length = 70)
    private String address2;

    @Column(name = "city", length = 50)
    private String city;

    @Column(name = "state", length = 50)
    private String state;

    @Column(name = "zip", length = 10)
    private String zip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id")
    private Country country;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "ref_id")
    private Integer refId;

    @Column(name = "newsletter")
    @Builder.Default
    private Boolean newsletter = false;

    @Column(name = "ip", length = 15)
    private String ip;

    @Column(name = "role", nullable = false, length = 20)
    @Builder.Default
    private String role = "USER";

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "active";

    @Column(name = "auth_provider", length = 100)
    private String authProvider;

    @Column(name = "auth_uid", length = 50)
    private String authUid;

    @Column(name = "activation_key", length = 100)
    private String activationKey;

    @Column(name = "unsubscribe_key", length = 100)
    private String unsubscribeKey;

    @Column(name = "login_session", length = 255)
    private String loginSession;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "login_count")
    @Builder.Default
    private Integer loginCount = 0;

    @Column(name = "last_ip", length = 15)
    private String lastIp;

    @Column(name = "created", nullable = false)
    private LocalDateTime created;

    @Column(name = "block_reason")
    private String blockReason;

    @PrePersist
    protected void onCreate() {
        if (created == null) created = LocalDateTime.now();
    }

    // UserDetails methods
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return "active".equals(status); }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return "active".equals(status); }
}
