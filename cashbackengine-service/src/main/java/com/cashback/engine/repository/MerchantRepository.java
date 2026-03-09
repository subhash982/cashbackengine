package com.cashback.engine.repository;

import com.cashback.engine.domain.merchant.Merchant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, Long> {

    List<Merchant> findByActiveTrue();

    Page<Merchant> findByActiveTrue(Pageable pageable);

    List<Merchant> findByCategoryAndActiveTrue(String category);

    List<Merchant> findByAffiliateNetwork(String affiliateNetwork);
}
