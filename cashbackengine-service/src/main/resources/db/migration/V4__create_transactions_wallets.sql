CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    click_id BIGINT REFERENCES clicks(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    merchant_id BIGINT NOT NULL REFERENCES merchants(id),
    order_value NUMERIC(15, 4) NOT NULL,
    commission NUMERIC(15, 4) NOT NULL,
    cashback_amount NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(20) NOT NULL DEFAULT 'TRACKED',
    affiliate_network VARCHAR(100),
    network_transaction_id VARCHAR(100),
    rejection_reason VARCHAR(500),
    fraud_suspected BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ
);

CREATE INDEX idx_transactions_transaction_id ON transactions(transaction_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

CREATE TABLE wallets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    pending_amount NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
    confirmed_amount NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
    withdrawable_amount NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
    total_paid_amount NUMERIC(15, 4) NOT NULL DEFAULT 0.0000,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);
