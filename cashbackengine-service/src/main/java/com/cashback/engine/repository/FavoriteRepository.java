package com.cashback.engine.repository;

import com.cashback.engine.domain.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {

    @Query("SELECT f FROM Favorite f JOIN FETCH f.retailer WHERE f.user.userId = :userId ORDER BY f.added DESC")
    List<Favorite> findByUserUserId(@Param("userId") Integer userId);

    boolean existsByUserUserIdAndRetailerRetailerId(Integer userId, Integer retailerId);

    void deleteByUserUserIdAndRetailerRetailerId(Integer userId, Integer retailerId);
}
