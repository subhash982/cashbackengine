-- ============================================================
-- Cashback Engine - Full Schema
-- ============================================================

-- Affiliate Networks
CREATE TABLE cashbackengine_affnetworks (
    network_id SERIAL NOT NULL,
    network_name VARCHAR(255) NOT NULL,
    website VARCHAR(255) NOT NULL,
    image VARCHAR(100) NOT NULL,
    csv_format TEXT NOT NULL,
    confirmeds VARCHAR(100) NOT NULL,
    pendings VARCHAR(100) NOT NULL,
    declineds VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_csv_upload TIMESTAMP,
    PRIMARY KEY (network_id)
);

-- Categories
CREATE TABLE cashbackengine_categories (
    category_id SERIAL NOT NULL,
    parent_id INT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    category_url VARCHAR(100),
    meta_description VARCHAR(255),
    meta_keywords VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    sort_order INTEGER DEFAULT 0,
    PRIMARY KEY (category_id)
);

-- Countries
CREATE TABLE cashbackengine_countries (
    country_id SERIAL NOT NULL,
    code VARCHAR(2) NOT NULL,
    name VARCHAR(100) NOT NULL,
    currency VARCHAR(3),
    signup BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    PRIMARY KEY (country_id)
);

-- Users
CREATE TABLE cashbackengine_users (
    user_id SERIAL NOT NULL,
    username VARCHAR(70) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    fname VARCHAR(32),
    lname VARCHAR(25),
    address VARCHAR(32),
    address2 VARCHAR(70),
    city VARCHAR(50),
    state VARCHAR(50),
    zip VARCHAR(10),
    country_id INT,
    phone VARCHAR(20),
    payment_method VARCHAR(50),
    ref_id INT,
    newsletter BOOLEAN DEFAULT FALSE,
    ip VARCHAR(15),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    auth_provider VARCHAR(100),
    auth_uid VARCHAR(50),
    activation_key VARCHAR(100),
    unsubscribe_key VARCHAR(100),
    login_session VARCHAR(255),
    last_login TIMESTAMP,
    login_count INT DEFAULT 0,
    last_ip VARCHAR(15),
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    block_reason TEXT,
    FOREIGN KEY (country_id) REFERENCES cashbackengine_countries(country_id),
    PRIMARY KEY (user_id)
);

-- Insert default admin user (password: Admin@123)
INSERT INTO cashbackengine_users (username, password, email, fname, role, status, created)
VALUES ('admin', '$2b$10$0rTcZzkmde37hmUejjKVe.Z.ZYXgA5imNrqkYzKlX8n8G2qvRIm.O', 'admin@cashbackengine.com', 'Admin', 'ADMIN', 'active', NOW());

-- Retailers
CREATE TABLE cashbackengine_retailers (
    retailer_id SERIAL NOT NULL,
    title VARCHAR(255) NOT NULL,
    network_id INT,
    program_id VARCHAR(255),
    url VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    old_cashback VARCHAR(20),
    cashback VARCHAR(20),
    conditions TEXT,
    description TEXT,
    retailer_url VARCHAR(255),
    meta_description VARCHAR(255),
    meta_keywords VARCHAR(255),
    end_date TIMESTAMP,
    featured BOOLEAN DEFAULT FALSE,
    deal_of_week BOOLEAN DEFAULT FALSE,
    visits INT DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (network_id) REFERENCES cashbackengine_affnetworks(network_id),
    PRIMARY KEY (retailer_id)
);

CREATE TABLE cashbackengine_retailer_to_category (
    retailer_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (retailer_id) REFERENCES cashbackengine_retailers(retailer_id),
    FOREIGN KEY (category_id) REFERENCES cashbackengine_categories(category_id),
    PRIMARY KEY (retailer_id, category_id)
);

CREATE TABLE cashbackengine_retailer_to_country (
    retailer_id INT NOT NULL,
    country_id INT NOT NULL,
    FOREIGN KEY (retailer_id) REFERENCES cashbackengine_retailers(retailer_id),
    FOREIGN KEY (country_id) REFERENCES cashbackengine_countries(country_id),
    PRIMARY KEY (retailer_id, country_id)
);

-- Coupons
CREATE TABLE cashbackengine_coupons (
    coupon_id SERIAL NOT NULL,
    retailer_id INT NOT NULL,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(255),
    link VARCHAR(255),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    description TEXT,
    exclusive BOOLEAN DEFAULT FALSE,
    visits INT DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    viewed BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (retailer_id) REFERENCES cashbackengine_retailers(retailer_id),
    FOREIGN KEY (user_id) REFERENCES cashbackengine_users(user_id),
    PRIMARY KEY (coupon_id)
);

-- Click History
CREATE TABLE cashbackengine_clickhistory (
    click_id SERIAL NOT NULL,
    user_id INT NOT NULL,
    retailer_id INT NOT NULL,
    added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES cashbackengine_users(user_id),
    FOREIGN KEY (retailer_id) REFERENCES cashbackengine_retailers(retailer_id),
    PRIMARY KEY (click_id)
);

-- Favorites
CREATE TABLE cashbackengine_favorites (
    favorite_id SERIAL NOT NULL,
    user_id INT NOT NULL,
    retailer_id INT NOT NULL,
    added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES cashbackengine_users(user_id),
    FOREIGN KEY (retailer_id) REFERENCES cashbackengine_retailers(retailer_id),
    PRIMARY KEY (favorite_id)
);

-- Transactions
CREATE TABLE cashbackengine_transactions (
    transaction_id SERIAL NOT NULL,
    reference_id VARCHAR(50),
    network_id INT,
    retailer VARCHAR(100),
    program_id VARCHAR(100),
    user_id INT NOT NULL,
    ref_id INT,
    payment_type VARCHAR(50),
    payment_method INT,
    payment_details TEXT,
    transaction_amount DECIMAL(15,4),
    transaction_commission DECIMAL(15,4),
    amount DECIMAL(15,4),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    reason TEXT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    process_date TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES cashbackengine_users(user_id),
    PRIMARY KEY (transaction_id)
);

-- Reviews
CREATE TABLE cashbackengine_reviews (
    review_id SERIAL NOT NULL,
    retailer_id INT NOT NULL,
    user_id INT NOT NULL,
    review_title VARCHAR(255),
    rating INTEGER,
    review TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP,
    FOREIGN KEY (retailer_id) REFERENCES cashbackengine_retailers(retailer_id),
    FOREIGN KEY (user_id) REFERENCES cashbackengine_users(user_id),
    PRIMARY KEY (review_id)
);

-- Messages
CREATE TABLE cashbackengine_messages (
    message_id SERIAL NOT NULL,
    user_id INT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    subject VARCHAR(100),
    message TEXT,
    viewed BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES cashbackengine_users(user_id),
    PRIMARY KEY (message_id)
);

CREATE TABLE cashbackengine_messages_answers (
    answer_id SERIAL NOT NULL,
    message_id INT NOT NULL,
    user_id INT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    answer TEXT,
    viewed BOOLEAN DEFAULT FALSE,
    answer_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES cashbackengine_messages(message_id),
    FOREIGN KEY (user_id) REFERENCES cashbackengine_users(user_id),
    PRIMARY KEY (answer_id)
);

-- Invitations
CREATE TABLE cashbackengine_invitations (
    invitation_id SERIAL NOT NULL,
    user_id INT NOT NULL,
    recipients TEXT,
    message TEXT,
    sent_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES cashbackengine_users(user_id),
    PRIMARY KEY (invitation_id)
);

-- Reports
CREATE TABLE cashbackengine_reports (
    report_id SERIAL NOT NULL,
    reporter_id INT,
    user_id INT,
    retailer_id INT,
    report TEXT,
    viewed BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES cashbackengine_users(user_id),
    FOREIGN KEY (retailer_id) REFERENCES cashbackengine_retailers(retailer_id),
    PRIMARY KEY (report_id)
);

-- News
CREATE TABLE cashbackengine_news (
    news_id SERIAL NOT NULL,
    news_title VARCHAR(255) NOT NULL,
    news_description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (news_id)
);

-- Content Pages
CREATE TABLE cashbackengine_content (
    content_id SERIAL NOT NULL,
    language VARCHAR(50),
    name VARCHAR(50),
    link_title VARCHAR(100),
    title VARCHAR(255),
    description TEXT,
    page_location VARCHAR(10),
    page_url VARCHAR(255),
    meta_description VARCHAR(255),
    meta_keywords VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (content_id)
);

-- Email Templates
CREATE TABLE cashbackengine_email_templates (
    template_id SERIAL NOT NULL,
    language VARCHAR(50),
    email_name VARCHAR(50),
    email_subject VARCHAR(255),
    email_message TEXT,
    modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (template_id)
);

-- Payment Methods
CREATE TABLE cashbackengine_pmethods (
    pmethod_id SERIAL NOT NULL,
    pmethod_title VARCHAR(100) NOT NULL,
    pmethod_details TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    PRIMARY KEY (pmethod_id)
);

-- Settings
CREATE TABLE cashbackengine_settings (
    setting_id SERIAL NOT NULL,
    setting_key VARCHAR(50) NOT NULL UNIQUE,
    setting_value TEXT,
    PRIMARY KEY (setting_id)
);
