package com.cashback.engine.controller;

import com.cashback.engine.domain.Content;
import com.cashback.engine.dto.request.ContentRequest;
import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.service.ContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Content>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(contentService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Content>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(contentService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Content>> create(@Valid @RequestBody ContentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Content created", contentService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Content>> update(
            @PathVariable Integer id,
            @Valid @RequestBody ContentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Content updated", contentService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        contentService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Content deleted", null));
    }
}
