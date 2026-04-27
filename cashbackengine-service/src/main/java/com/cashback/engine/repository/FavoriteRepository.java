package com.cashback.engine.repository;

import com.cashback.engine.domain.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {

    List<Favorite> findByUserUserId(Integer userId);

    boolean existsByUserUserIdAndRetailerRetailerId(Integer userId, Integer retailerId);
}
