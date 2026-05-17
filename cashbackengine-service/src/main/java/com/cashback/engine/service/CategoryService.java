package com.cashback.engine.service;

import com.cashback.engine.domain.Category;
import com.cashback.engine.domain.Retailer;
import com.cashback.engine.dto.request.CategoryRequest;
import com.cashback.engine.dto.response.RetailerResponse;
import com.cashback.engine.repository.CategoryRepository;
import com.cashback.engine.repository.RetailerToCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final RetailerToCategoryRepository retailerToCategoryRepository;

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<RetailerResponse> getRetailersByCategory(Integer categoryId) {
        return retailerToCategoryRepository.findByCategoryCategoryId(categoryId)
                .stream()
                .map(rtc -> rtc.getRetailer())
                .filter(r -> "active".equals(r.getStatus()))
                .sorted((a, b) -> Integer.compare(
                        b.getVisits() != null ? b.getVisits() : 0,
                        a.getVisits() != null ? a.getVisits() : 0))
                .map(RetailerResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + id));
    }

    @Transactional
    public Category createCategory(CategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .parentId(request.getParentId())
                .description(request.getDescription())
                .categoryUrl(request.getCategoryUrl())
                .alias(request.getAlias() != null ? request.getAlias() : "")
                .status(request.getStatus() != null ? request.getStatus() : "active")
                .build();
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Integer id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + id));
        category.setName(request.getName());
        category.setParentId(request.getParentId());
        category.setDescription(request.getDescription());
        category.setCategoryUrl(request.getCategoryUrl());
        category.setAlias(request.getAlias() != null ? request.getAlias() : "");
        if (request.getStatus() != null) category.setStatus(request.getStatus());
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Category not found: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
