package com.cashback.engine.repository;

import com.cashback.engine.domain.click.Click;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClickRepository extends JpaRepository<Click, Long> {

    Optional<Click> findByClickId(String clickId);

    Page<Click> findByUserId(Long userId, Pageable pageable);

    List<Click> findByUserIdAndMerchantIdAndClickedAtAfter(Long userId, Long merchantId, Instant after);

    @Query("SELECT COUNT(c) FROM Click c WHERE c.user.id = :userId AND c.clickedAt >= :since")
    long countClicksByUserSince(@Param("userId") Long userId, @Param("since") Instant since);

    @Query("SELECT COUNT(c) FROM Click c WHERE c.ipAddress = :ip AND c.clickedAt >= :since")
    long countClicksByIpSince(@Param("ip") String ip, @Param("since") Instant since);
}
