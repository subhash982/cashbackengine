package com.cashback.engine.service;

import com.cashback.engine.domain.Category;
import com.cashback.engine.dto.request.CategoryRequest;
import com.cashback.engine.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
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
