package com.cashback.engine.repository;

import com.cashback.engine.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    List<Message> findByUserUserId(Integer userId);

    List<Message> findByStatus(String status);
}
