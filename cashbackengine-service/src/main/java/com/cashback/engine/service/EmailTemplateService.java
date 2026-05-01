package com.cashback.engine.service;

import com.cashback.engine.domain.EmailTemplate;
import com.cashback.engine.dto.request.EmailTemplateRequest;
import com.cashback.engine.repository.EmailTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailTemplateService {

    private final EmailTemplateRepository emailTemplateRepository;

    @Transactional(readOnly = true)
    public List<EmailTemplate> getAll() {
        return emailTemplateRepository.findAll();
    }

    @Transactional(readOnly = true)
    public EmailTemplate getById(Integer id) {
        return emailTemplateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Email template not found: " + id));
    }

    @Transactional
    public EmailTemplate create(EmailTemplateRequest request) {
        EmailTemplate template = new EmailTemplate();
        applyRequest(template, request);
        return emailTemplateRepository.save(template);
    }

    @Transactional
    public EmailTemplate update(Integer id, EmailTemplateRequest request) {
        EmailTemplate template = emailTemplateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Email template not found: " + id));
        applyRequest(template, request);
        return emailTemplateRepository.save(template);
    }

    @Transactional
    public void delete(Integer id) {
        if (!emailTemplateRepository.existsById(id)) {
            throw new IllegalArgumentException("Email template not found: " + id);
        }
        emailTemplateRepository.deleteById(id);
    }

    private void applyRequest(EmailTemplate template, EmailTemplateRequest request) {
        template.setEmailName(request.getEmailName());
        template.setLanguage(request.getLanguage() != null ? request.getLanguage() : "english");
        template.setEmailSubject(request.getEmailSubject());
        template.setEmailMessage(request.getEmailMessage() != null ? request.getEmailMessage() : "");
    }
}
