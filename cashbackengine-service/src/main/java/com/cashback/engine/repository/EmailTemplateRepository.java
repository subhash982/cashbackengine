package com.cashback.engine.repository;

import com.cashback.engine.domain.EmailTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, Integer> {

    Optional<EmailTemplate> findByEmailName(String emailName);
}
