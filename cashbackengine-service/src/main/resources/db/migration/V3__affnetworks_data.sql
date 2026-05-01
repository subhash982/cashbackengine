-- ============================================================
-- V3: Replace affnetworks data from MySQL dump
-- ============================================================

-- Clear existing data (retailers FK on network_id already dropped in V2)
TRUNCATE TABLE cashbackengine_affnetworks RESTART IDENTITY CASCADE;

-- Insert networks from dump
INSERT INTO cashbackengine_affnetworks (network_id, network_name, website, image, csv_format, confirmeds, pendings, declineds, status, added, last_csv_upload) VALUES
(1, 'vCommission', 'partners.vcommission.com', 'vCommission.png', '"{TRNSTMSTP}","Flipkart.com CPS - India","{STATUS}","{COMMISSION}","{PMNTDETAIL}","{AMOUNT}","111.118.214.5","{TRANSACTIONID}","{USERID}","{HIFIREFID}","{ADVTSUBID}","{PROGRAMID}"', 'confirmed', 'pend|approved', 'dec', 'active', '2016-04-08 00:00:00', '2016-05-14 21:31:54'),
(11, 'Flipkart', 'https://affiliate.flipkart.com/', 'flipkart.png', '"2016-04-16 01:16:35","Flipkart.com CPS - India","{STATUS}","{COMMISSION}","{AMOUNT}","111.118.214.5","{TRANSACTIONID}","{USERID}","{PROGRAMID}"', 'confirmed', 'pend|approved', 'decline', 'active', '2016-05-01 03:32:13', NULL),
(12, 'Snapdeal', 'https://affiliate.snapdeal.com/', 'SnapDeal.jpg', '"4th May 2010","Sale","{TRANSACTIONID}","sim_sale","{STATUS}","No","{AMOUNT}","{COMMISSION}","{PROGRAMID}","UNIBET","{USERID}"', 'approved', 'pending', 'cancelled', 'active', '2016-05-01 16:24:06', NULL);

-- Reset sequence to max inserted id
SELECT setval('cashbackengine_affnetworks_network_id_seq', (SELECT MAX(network_id) FROM cashbackengine_affnetworks));
