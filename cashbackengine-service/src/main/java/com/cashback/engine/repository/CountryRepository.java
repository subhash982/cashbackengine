package com.cashback.engine.repository;

import com.cashback.engine.domain.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CountryRepository extends JpaRepository<Country, Integer> {

    List<Country> findByStatus(String status);

    Optional<Country> findByCode(String code);
}
