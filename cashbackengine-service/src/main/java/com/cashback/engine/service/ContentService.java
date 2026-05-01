package com.cashback.engine.service;

import com.cashback.engine.domain.Content;
import com.cashback.engine.dto.request.ContentRequest;
import com.cashback.engine.repository.ContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final ContentRepository contentRepository;

    @Transactional(readOnly = true)
    public List<Content> getAll() {
        return contentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Content getById(Integer id) {
        return contentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Content not found: " + id));
    }

    @Transactional
    public Content create(ContentRequest request) {
        Content content = new Content();
        applyRequest(content, request);
        return contentRepository.save(content);
    }

    @Transactional
    public Content update(Integer id, ContentRequest request) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Content not found: " + id));
        applyRequest(content, request);
        return contentRepository.save(content);
    }

    @Transactional
    public void delete(Integer id) {
        if (!contentRepository.existsById(id)) {
            throw new IllegalArgumentException("Content not found: " + id);
        }
        contentRepository.deleteById(id);
    }

    private void applyRequest(Content content, ContentRequest request) {
        content.setName(request.getName());
        content.setLanguage(request.getLanguage() != null ? request.getLanguage() : "english");
        content.setLinkTitle(request.getLinkTitle() != null ? request.getLinkTitle() : "");
        content.setTitle(request.getTitle() != null ? request.getTitle() : "");
        content.setDescription(request.getDescription() != null ? request.getDescription() : "");
        content.setPageLocation(request.getPageLocation() != null ? request.getPageLocation() : "");
        content.setPageUrl(request.getPageUrl() != null ? request.getPageUrl() : "");
        content.setMetaDescription(request.getMetaDescription() != null ? request.getMetaDescription() : "");
        content.setMetaKeywords(request.getMetaKeywords() != null ? request.getMetaKeywords() : "");
        content.setStatus(request.getStatus() != null ? request.getStatus() : "active");
    }
}
