package com.cashback.engine.repository;

import com.cashback.engine.domain.AffNetwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AffNetworkRepository extends JpaRepository<AffNetwork, Integer> {

    List<AffNetwork> findByStatus(String status);
}
