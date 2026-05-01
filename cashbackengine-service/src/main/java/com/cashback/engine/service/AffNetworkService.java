package com.cashback.engine.service;

import com.cashback.engine.domain.AffNetwork;
import com.cashback.engine.dto.request.AffNetworkRequest;
import com.cashback.engine.dto.response.AffNetworkResponse;
import com.cashback.engine.repository.AffNetworkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AffNetworkService {

    private final AffNetworkRepository affNetworkRepository;

    @Transactional(readOnly = true)
    public List<AffNetworkResponse> getAll() {
        return affNetworkRepository.findAll()
                .stream()
                .map(AffNetworkResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AffNetworkResponse getById(Integer id) {
        return AffNetworkResponse.from(findOrThrow(id));
    }

    @Transactional
    public AffNetworkResponse create(AffNetworkRequest request) {
        AffNetwork network = new AffNetwork();
        applyRequest(network, request);
        return AffNetworkResponse.from(affNetworkRepository.save(network));
    }

    @Transactional
    public AffNetworkResponse update(Integer id, AffNetworkRequest request) {
        AffNetwork network = findOrThrow(id);
        applyRequest(network, request);
        return AffNetworkResponse.from(affNetworkRepository.save(network));
    }

    @Transactional
    public void delete(Integer id) {
        if (!affNetworkRepository.existsById(id)) {
            throw new IllegalArgumentException("AffNetwork not found: " + id);
        }
        affNetworkRepository.deleteById(id);
    }

    private AffNetwork findOrThrow(Integer id) {
        return affNetworkRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("AffNetwork not found: " + id));
    }

    private void applyRequest(AffNetwork network, AffNetworkRequest request) {
        network.setNetworkName(request.getNetworkName());
        network.setWebsite(request.getWebsite());
        network.setImage(request.getImage() != null ? request.getImage() : "");
        network.setCsvFormat(request.getCsvFormat() != null ? request.getCsvFormat() : "");
        network.setConfirmeds(request.getConfirmeds() != null ? request.getConfirmeds() : "");
        network.setPendings(request.getPendings() != null ? request.getPendings() : "");
        network.setDeclineds(request.getDeclineds() != null ? request.getDeclineds() : "");
        network.setStatus(request.getStatus() != null ? request.getStatus() : "active");
    }
}
