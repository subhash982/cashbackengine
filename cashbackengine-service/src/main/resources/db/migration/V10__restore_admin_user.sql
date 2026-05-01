-- ============================================================
-- V10: Restore admin user (wiped by V7 countries CASCADE)
-- ============================================================

-- Re-insert admin user (password: Admin@123)
INSERT INTO cashbackengine_users (username, password, email, fname, role, status, created)
VALUES ('admin', '$2b$10$0rTcZzkmde37hmUejjKVe.Z.ZYXgA5imNrqkYzKlX8n8G2qvRIm.O', 'admin@cashbackengine.com', 'Admin', 'ADMIN', 'active', NOW())
ON CONFLICT DO NOTHING;
