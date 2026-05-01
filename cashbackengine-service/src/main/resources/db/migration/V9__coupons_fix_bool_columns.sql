-- ============================================================
-- V9: Change coupon boolean columns to SMALLINT for MySQL compat
-- ============================================================

-- Drop defaults first, then alter type, then restore defaults
ALTER TABLE cashbackengine_coupons ALTER COLUMN exclusive DROP DEFAULT;
ALTER TABLE cashbackengine_coupons ALTER COLUMN exclusive TYPE SMALLINT USING exclusive::int;
ALTER TABLE cashbackengine_coupons ALTER COLUMN exclusive SET DEFAULT 0;

ALTER TABLE cashbackengine_coupons ALTER COLUMN viewed DROP DEFAULT;
ALTER TABLE cashbackengine_coupons ALTER COLUMN viewed TYPE SMALLINT USING viewed::int;
ALTER TABLE cashbackengine_coupons ALTER COLUMN viewed SET DEFAULT 0;

ALTER TABLE cashbackengine_coupons ALTER COLUMN special DROP DEFAULT;
ALTER TABLE cashbackengine_coupons ALTER COLUMN special TYPE SMALLINT USING special::int;
ALTER TABLE cashbackengine_coupons ALTER COLUMN special SET DEFAULT 0;
