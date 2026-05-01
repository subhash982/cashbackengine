-- ============================================================
-- V6: Load content pages data
-- ============================================================

TRUNCATE TABLE cashbackengine_content RESTART IDENTITY CASCADE;

INSERT INTO cashbackengine_content (content_id, language, name, link_title, title, description, page_location, page_url, meta_description, meta_keywords, status, modified) VALUES
(1, 'english', 'home', '', 'Home page',
 '<img src=''/images/home_img.gif'' align=''left'' border=''0'' alt='''' />
<h1 style=''border:none;text-align:center;''>Welcome to our cashback website!</h1>
<p style=''text-align: justify;''>Open your own free account now and start to earn cashback. Its totally free and simple. Save money on online shopping now! Our site helps you to earn on cash back rewards, simply sign up for free and you will start earning immediately on your purchases. Earn cashback by shopping with your favorite stores.</p>
<p>Start earning cash back on your online purchases!</p>
<br/><p align=''center''><a class=''start_link'' href=''signup.php''>Start Earning!</a></p>',
 '', '', '', '', 'active', '2016-03-16 05:04:41'),

(2, 'english', 'aboutus', '', 'About Us',
 '<p>Some information about site.</p>',
 '', '', '', '', 'active', CURRENT_TIMESTAMP),

(3, 'english', 'howitworks', '', 'How it works',
 '<p>Earn cashback on your online shopping with our site, here is how:</p>
<ul>
  <li>Sign Up</li>
  <li>Find your favorite shops</li>
  <li>Make shopping as usually</li>
  <li>Earn great cashback!</li>
</ul>
<p>Shop from hundreds of your favorite stores and earn cash back. Find new stores daily. Join now and start earning cashback!</p>',
 '', '', '', '', 'active', '2016-03-16 05:04:41'),

(4, 'english', 'help', '', 'Help',
 '<p><b>Here is how to start earning cashback:</b></p>
<ul>
  <li>Create a free account</li>
  <li>Find the shop you need</li>
  <li>Click the link to visit the retailers site</li>
  <li>Shop as you would normally</li>
  <li>Get cash back!</li>
</ul>',
 '', '', '', '', 'active', '2016-03-16 05:04:41'),

(5, 'english', 'terms', '', 'Terms and Conditions',
 '<p>website terms and conditions</p>',
 '', '', '', '', 'active', '2016-03-16 05:04:41'),

(6, 'english', 'privacy', '', 'Privacy Policy',
 '<p>privacy policy information goes here</p>',
 '', '', '', '', 'active', '2016-03-16 05:04:41'),

(7, 'english', 'contact', '', 'Contact Us',
 '<p>If you have any questions, please contact us.</p>

<p>Email: support@hificashback.com</p>',
 '', '', '', '', 'active', '2016-04-24 17:55:06');

-- Reset sequence
SELECT setval('cashbackengine_content_content_id_seq', (SELECT MAX(content_id) FROM cashbackengine_content));
