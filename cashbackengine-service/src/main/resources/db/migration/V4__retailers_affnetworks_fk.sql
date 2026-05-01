-- ============================================================
-- V4: Restore FK constraint on cashbackengine_retailers.network_id
-- ============================================================

ALTER TABLE cashbackengine_retailers
    ADD CONSTRAINT cashbackengine_retailers_network_id_fkey
    FOREIGN KEY (network_id) REFERENCES cashbackengine_affnetworks(network_id);
