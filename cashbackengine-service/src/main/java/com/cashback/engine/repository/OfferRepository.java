package com.cashback.engine.repository;

import com.cashback.engine.domain.offer.Offer;
import com.cashback.engine.domain.offer.OfferType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    List<Offer> findByMerchantIdAndActiveTrue(Long merchantId);

    Page<Offer> findByActiveTrue(Pageable pageable);

    List<Offer> findByOfferTypeAndActiveTrue(OfferType offerType);

    @Query("SELECT o FROM Offer o WHERE o.active = true AND (o.startDate IS NULL OR o.startDate <= :now) AND (o.endDate IS NULL OR o.endDate >= :now)")
    List<Offer> findActiveOffers(@Param("now") Instant now);

    @Query("SELECT o FROM Offer o WHERE o.merchant.id = :merchantId AND o.active = true AND (o.startDate IS NULL OR o.startDate <= :now) AND (o.endDate IS NULL OR o.endDate >= :now)")
    List<Offer> findActiveOffersByMerchant(@Param("merchantId") Long merchantId, @Param("now") Instant now);
}
