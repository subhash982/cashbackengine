package com.cashback.engine.repository;

import com.cashback.engine.domain.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Integer> {

    List<Invitation> findByUserUserId(Integer userId);
}
