-- Ensure admin password is set to Admin1234 ($2a$ BCrypt hash compatible with Spring Security)
UPDATE cashbackengine_users
SET password = '$2a$10$heT6fyVPmwVmkcx4Mkmy0OmXZNBsOcb2b119cOEImkXF5sjc/u7Yi'
WHERE email = 'admin@cashbackengine.com';
