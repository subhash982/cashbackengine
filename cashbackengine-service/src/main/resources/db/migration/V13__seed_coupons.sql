-- Seed sample coupons for initial data
INSERT INTO cashbackengine_coupons (retailer_id, title, code, link, start_date, end_date, description, exclusive, status, coupon_type, offer, special)
VALUES
  (504, 'Flat 20% OFF on all medicines', 'HEALTH20', 'https://1mg.com', NOW(), NOW() + INTERVAL '30 days', 'Get 20% off on all medicines and health products', 1, 'active', 'Coupon', '20% OFF', 1),
  (504, 'Extra 15% OFF on first order', 'FIRST15', 'https://1mg.com', NOW(), NOW() + INTERVAL '15 days', 'New users get 15% additional discount on first order', 0, 'active', 'Coupon', '15% OFF', 0),
  (513, 'Amazon Sale - Up to 40% OFF', 'AMAZON40', 'https://amazon.in', NOW(), NOW() + INTERVAL '7 days', 'Grab amazing deals on electronics, fashion and more', 1, 'active', 'Coupon', '40% OFF', 1),
  (513, 'Free shipping on orders above Rs 499', 'FREESHIP', 'https://amazon.in', NOW(), NOW() + INTERVAL '60 days', 'Get free delivery on eligible orders above Rs 499', 0, 'active', 'Deal', 'Free Ship', 0),
  (512, 'Airtel Recharge Cashback Rs 100', 'AIR100', 'https://airtel.in', NOW(), NOW() + INTERVAL '20 days', 'Get Rs 100 cashback on recharge of Rs 299 and above', 1, 'active', 'Coupon', 'Rs 100 CB', 1),
  (507, 'Abof - 30% OFF on fashion', 'FASHION30', 'https://abof.com', NOW(), NOW() + INTERVAL '10 days', 'Flat 30% off on all fashion products', 0, 'active', 'Coupon', '30% OFF', 0),
  (511, 'Ace2Three - Welcome Bonus Rs 500', 'ACE500', 'https://ace2three.com', NOW(), NOW() + INTERVAL '30 days', 'Get Rs 500 welcome bonus on first deposit', 1, 'active', 'Deal', 'Rs 500 Bonus', 1),
  (504, 'Buy 2 Get 1 Free on vitamins', '', 'https://1mg.com', NOW(), NOW() + INTERVAL '5 days', 'Buy any 2 vitamin products and get 1 free', 0, 'active', 'Deal', 'B2G1', 0),
  (513, 'Amazon Pay cashback 10%', 'AMPAY10', 'https://amazon.in', NOW(), NOW() + INTERVAL '14 days', '10% cashback when paying with Amazon Pay', 0, 'active', 'Coupon', '10% CB', 0),
  (512, 'Airtel Broadband - 2 months free', 'BROAD2M', 'https://airtel.in', NOW(), NOW() + INTERVAL '30 days', 'Get 2 months free on annual broadband plan', 1, 'active', 'Deal', '2 Months Free', 1);
