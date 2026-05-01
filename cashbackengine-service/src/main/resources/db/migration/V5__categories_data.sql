-- ============================================================
-- V5: Add alias column and load categories data
-- ============================================================

-- Add alias column from MySQL dump schema
ALTER TABLE cashbackengine_categories
    ADD COLUMN IF NOT EXISTS alias VARCHAR(512) NOT NULL DEFAULT '';

-- Clear existing data and load from dump
TRUNCATE TABLE cashbackengine_categories RESTART IDENTITY CASCADE;

INSERT INTO cashbackengine_categories (category_id, parent_id, name, description, category_url, meta_description, meta_keywords, sort_order, alias, status) VALUES
(157, 0, 'Auction', '', '', '', '', 0, '', 'active'),
(158, 0, 'Automotive', '', '', '', '', 0, 'automotive', 'active'),
(159, 0, 'Biz Opp', '', '', '', '', 0, '', 'active'),
(160, 0, 'Careers & Jobs', '', '', '', '', 0, '', 'active'),
(161, 0, 'Daily Deals', '', '', '', '', 0, '', 'active'),
(162, 0, 'Dating', '', '', '', '', 0, '', 'active'),
(163, 0, 'Web Download/Install', '', '', '', '', 0, '', 'active'),
(164, 0, 'Mobile Install', '', '', '', '', 0, '', 'active'),
(165, 0, 'E-Commerce', '', '', '', '', 0, '', 'active'),
(166, 0, 'Education', '', '', '', '', 0, '', 'active'),
(167, 0, 'Entertainment & Music', '', '', '', '', 0, 'Entertainment & Music,music_movies_poster,home_entertainment,musical_instruments', 'active'),
(168, 0, 'Finance', '', '', '', '', 0, '', 'active'),
(169, 0, 'Food & Beverage', '', '', '', '', 0, 'Food & Beverage,food_nutrition', 'active'),
(170, 0, 'Gaming', '', '', '', '', 0, 'Gaming,gaming', 'active'),
(171, 0, 'Health & Beauty', '', '', '', '', 0, 'Health & Beauty,beauty_personal_care', 'active'),
(172, 0, 'Incentivized', '', '', '', '', 0, '', 'active'),
(173, 0, 'Matrimony', '', '', '', '', 0, '', 'active'),
(174, 0, 'Mobile VAS', '', '', '', '', 0, '', 'active'),
(175, 0, 'Real Estate', '', '', '', '', 0, '', 'active'),
(176, 0, 'Survey', '', '', '', '', 0, '', 'active'),
(177, 0, 'Travel', '', '', '', '', 0, '', 'active'),
(178, 0, 'Insurance', '', '', '', '', 0, '', 'active'),
(179, 0, 'Lifestyle', '', '', '', '', 0, '', 'active'),
(180, 0, 'Car & Taxi Rental', '', '', '', '', 0, '', 'active'),
(181, 0, 'As Seen On TV', '', '', '', '', 0, '', 'active'),
(182, 0, 'Banking', '', '', '', '', 0, '', 'active'),
(183, 0, 'Personalized Stuff', '', '', '', '', 0, '', 'active'),
(184, 0, 'Kids & Children', '', '', '', '', 0, 'Kids & Children,baby_care,toys_school_supplies', 'active'),
(185, 0, 'Decor & Furniture', '', '', '', '', 0, 'Decor & Furniture,home_decor,furniture,home_furnishing', 'active'),
(186, 0, 'Women Lingerie', '', '', '', '', 0, '', 'active'),
(187, 0, 'Jewellery', '', '', '', '', 0, 'Jewellery,jewellery', 'active'),
(188, 0, 'Sports & Fitness', '', '', '', '', 0, 'Sports & Fitness,sports_fitness', 'active'),
(189, 0, 'Astrology', '', '', '', '', 0, '', 'active'),
(190, 0, 'Content Lock', '', '', '', '', 0, '', 'active'),
(191, 0, 'Computers & Internet', '', '', '', '', 0, 'Computers & Internet,computers', 'active'),
(192, 0, 'Gambling', '', '', '', '', 0, '', 'active'),
(193, 0, 'Fashion & Accessories', '', '', '', '', 0, 'Fashion & Accessories,sunglasses,wearable_smart_devices,bags_wallets_belts', 'active'),
(194, 0, 'Apparel', '', '', '', '', 0, 'Apparel,clothing', 'active'),
(195, 0, 'Tools & Hardware', '', '', '', '', 0, 'Tools,Tools & Hardware,home_improvement,tools_hardware', 'active'),
(196, 0, 'Stationery', '', '', '', '', 0, 'Stationery,pens_stationery', 'active'),
(197, 0, 'Kitchen & Appliances', '', '', '', '', 0, 'Kitchen & Appliances,home_kitchen,kitchen_dining', 'active'),
(198, 0, 'Electronics', '', '', '', '', 0, 'Electronics,cameras_and_accessories', 'active'),
(199, 0, 'Pet Supplies', '', '', '', '', 0, 'Pet Supplies,pet_supplies', 'active'),
(200, 0, 'Footwear', '', '', '', '', 0, 'Footwear,footwear', 'active'),
(201, 0, 'Mobiles & Accessories', '', '', '', '', 0, 'Mobiles & Accessories,mobiles_and_accessories', 'active');

-- Reset sequence
SELECT setval('cashbackengine_categories_category_id_seq', (SELECT MAX(category_id) FROM cashbackengine_categories));
