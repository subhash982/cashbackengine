CREATE TABLE merchants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    website_url VARCHAR(500) NOT NULL,
    affiliate_tracking_url VARCHAR(500),
    logo_url VARCHAR(100),
    category VARCHAR(100),
    affiliate_network VARCHAR(50) NOT NULL,
    affiliate_network_merchant_id VARCHAR(100),
    default_commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    user_share_percentage NUMERIC(5, 2) NOT NULL DEFAULT 70.00,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_merchants_active ON merchants(active);
CREATE INDEX idx_merchants_category ON merchants(category);
CREATE INDEX idx_merchants_affiliate_network ON merchants(affiliate_network);

CREATE TABLE offers (
    id BIGSERIAL PRIMARY KEY,
    merchant_id BIGINT NOT NULL REFERENCES merchants(id),
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    offer_type VARCHAR(30) NOT NULL DEFAULT 'STANDARD',
    cashback_percentage NUMERIC(5, 2) NOT NULL,
    category VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    campaign_code VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_offers_merchant_active ON offers(merchant_id, active);
CREATE INDEX idx_offers_active_dates ON offers(active, start_date, end_date);

-- Sample merchants
INSERT INTO merchants (name, website_url, affiliate_network, default_commission_rate, user_share_percentage, category, description)
VALUES
    ('Amazon', 'https://www.amazon.com', 'Impact', 4.00, 70.00, 'Shopping', 'World largest online retailer'),
    ('eBay', 'https://www.ebay.com', 'CJ Affiliate', 3.00, 70.00, 'Shopping', 'Online auction and shopping'),
    ('Nike', 'https://www.nike.com', 'Rakuten Advertising', 8.00, 75.00, 'Fashion', 'Sports apparel and footwear'),
    ('Booking.com', 'https://www.booking.com', 'ShareASale', 5.00, 70.00, 'Travel', 'Hotel and accommodation booking');
