package com.cashback.engine.repository;

import com.cashback.engine.domain.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContentRepository extends JpaRepository<Content, Integer> {

    List<Content> findByStatus(String status);

    Optional<Content> findByName(String name);
}
