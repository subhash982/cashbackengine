CREATE TABLE clicks (
    id BIGSERIAL PRIMARY KEY,
    click_id VARCHAR(36) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    merchant_id BIGINT NOT NULL REFERENCES merchants(id),
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    device VARCHAR(100),
    session_id VARCHAR(100),
    referrer VARCHAR(100),
    fraud_suspected BOOLEAN NOT NULL DEFAULT FALSE,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clicks_click_id ON clicks(click_id);
CREATE INDEX idx_clicks_user_id ON clicks(user_id);
CREATE INDEX idx_clicks_merchant_id ON clicks(merchant_id);
CREATE INDEX idx_clicks_clicked_at ON clicks(clicked_at);
CREATE INDEX idx_clicks_ip_clicked_at ON clicks(ip_address, clicked_at);
