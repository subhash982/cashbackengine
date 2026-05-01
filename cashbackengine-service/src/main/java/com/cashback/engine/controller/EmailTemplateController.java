package com.cashback.engine.controller;

import com.cashback.engine.domain.EmailTemplate;
import com.cashback.engine.dto.request.EmailTemplateRequest;
import com.cashback.engine.dto.response.ApiResponse;
import com.cashback.engine.service.EmailTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/email-templates")
@RequiredArgsConstructor
public class EmailTemplateController {

    private final EmailTemplateService emailTemplateService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmailTemplate>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(emailTemplateService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmailTemplate>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(emailTemplateService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmailTemplate>> create(@Valid @RequestBody EmailTemplateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Template created", emailTemplateService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmailTemplate>> update(
            @PathVariable Integer id,
            @Valid @RequestBody EmailTemplateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Template updated", emailTemplateService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        emailTemplateService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Template deleted", null));
    }
}
