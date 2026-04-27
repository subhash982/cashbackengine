package com.cashback.engine.repository;

import com.cashback.engine.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findByStatus(String status);

    List<Category> findByParentId(Integer parentId);
}
