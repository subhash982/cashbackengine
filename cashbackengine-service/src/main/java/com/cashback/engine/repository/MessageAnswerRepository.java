package com.cashback.engine.repository;

import com.cashback.engine.domain.MessageAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageAnswerRepository extends JpaRepository<MessageAnswer, Integer> {

    List<MessageAnswer> findByMessageMessageId(Integer messageId);
}
