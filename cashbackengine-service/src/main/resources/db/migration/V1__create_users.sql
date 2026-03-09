CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    wallet_balance NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
    phone_number VARCHAR(20),
    country VARCHAR(50),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    social_provider VARCHAR(100),
    social_provider_id VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Insert a default admin user (password: Admin@123)
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
VALUES (
    'admin@cashbackengine.com',
    '$2a$12$LYGxe3bJ.VqxhWqZLFWVEuaDVg0jXQ4S/3bZH5aVn.LPgAuWyGa2W',
    'System',
    'Admin',
    'ADMIN',
    TRUE
);
