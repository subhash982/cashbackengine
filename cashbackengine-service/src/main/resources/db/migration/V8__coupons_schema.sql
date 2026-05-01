-- ============================================================
-- V8: Enhance coupons schema with missing columns from MySQL dump
-- ============================================================

-- Drop FK on retailer_id temporarily (coupon retailer_ids may not all exist)
ALTER TABLE cashbackengine_coupons DROP CONSTRAINT IF EXISTS cashbackengine_coupons_retailer_id_fkey;

-- Drop FK on user_id (coupons have user_id = 0 which doesn't exist)
ALTER TABLE cashbackengine_coupons DROP CONSTRAINT IF EXISTS cashbackengine_coupons_user_id_fkey;

-- Change link column to TEXT (URLs in dump exceed 255 chars)
ALTER TABLE cashbackengine_coupons ALTER COLUMN link TYPE TEXT;

-- Add missing columns
ALTER TABLE cashbackengine_coupons
    ADD COLUMN IF NOT EXISTS promo_id VARCHAR(16) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS coupon_type VARCHAR(20) NOT NULL DEFAULT 'Coupon',
    ADD COLUMN IF NOT EXISTS old_offer VARCHAR(20),
    ADD COLUMN IF NOT EXISTS offer VARCHAR(20),
    ADD COLUMN IF NOT EXISTS offer_img VARCHAR(256),
    ADD COLUMN IF NOT EXISTS special BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS banner_img VARCHAR(256),
    ADD COLUMN IF NOT EXISTS offer_template VARCHAR(32);
