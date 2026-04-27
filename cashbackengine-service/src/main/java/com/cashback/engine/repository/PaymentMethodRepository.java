package com.cashback.engine.repository;

import com.cashback.engine.domain.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Integer> {

    List<PaymentMethod> findByStatus(String status);
}
