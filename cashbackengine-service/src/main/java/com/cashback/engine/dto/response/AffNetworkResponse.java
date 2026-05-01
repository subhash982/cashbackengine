package com.cashback.engine.dto.response;

import com.cashback.engine.domain.AffNetwork;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AffNetworkResponse {
    private Integer networkId;
    private String networkName;
    private String website;
    private String image;
    private String csvFormat;
    private String confirmeds;
    private String pendings;
    private String declineds;
    private String status;
    private LocalDateTime added;
    private LocalDateTime lastCsvUpload;

    public static AffNetworkResponse from(AffNetwork n) {
        return AffNetworkResponse.builder()
                .networkId(n.getNetworkId())
                .networkName(n.getNetworkName())
                .website(n.getWebsite())
                .image(n.getImage())
                .csvFormat(n.getCsvFormat())
                .confirmeds(n.getConfirmeds())
                .pendings(n.getPendings())
                .declineds(n.getDeclineds())
                .status(n.getStatus())
                .added(n.getAdded())
                .lastCsvUpload(n.getLastCsvUpload())
                .build();
    }
}
