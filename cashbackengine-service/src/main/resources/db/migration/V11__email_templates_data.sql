-- ============================================================
-- V11: Load email templates data
-- ============================================================

TRUNCATE TABLE cashbackengine_email_templates RESTART IDENTITY CASCADE;

INSERT INTO cashbackengine_email_templates (template_id, language, email_name, email_subject, email_message, modified) VALUES
(1, 'english', 'signup', 'Welcome to HiFi Cashback!',
'<table align="center" border="0" cellpadding="0" cellspacing="0" style="width:550px">
	<tbody>
		<tr><td><p><img src="http://hificashback.com/images/hifi/logo.jpg" /></p></td></tr>
		<tr><td>
		<table border="0" cellpadding="0" cellspacing="0" style="width:100%">
			<tbody><tr><td>
			<p>Hello <strong>{first_name},</strong></p>
			<p>Thank you for registering!<br />Start earning cash back on your online purchases right away!</p>
			<p>Here is your login information:</p>
			<p>Login: <strong>{username}</strong><br />Password: <strong>{password}</strong></p>
			<p>Please <a href="{login_url}">click here</a> to login in to your account.</p>
			<p><br />Thanks much,<br />Hifi Cashback Team</p>
			</td></tr></tbody>
		</table>
		</td></tr>
		<tr><td>
		<table border="0" cellpadding="0" cellspacing="0" style="width:100%">
			<tbody><tr><td style="text-align:center">
			<p><a href="#">RSS Feed</a> Copyright &copy; 2016 HifiCashback.com. All rights reserved.<br />
			<a href="#">Terms &amp; Conditions</a> &middot; <a href="#">Privacy Policy</a> &middot;</p>
			</td></tr></tbody>
		</table>
		</td></tr>
	</tbody>
</table>',
'2016-03-29 15:18:31'),

(2, 'english', 'activate', 'Registration confirmation email',
'<table align="center" border="0" cellpadding="0" cellspacing="0" style="width:550px">
	<tbody>
		<tr><td><p><img src="http://hificashback.com/images/hifi/logo.jpg" /></p></td></tr>
		<tr><td>
		<table border="0" cellpadding="0" cellspacing="0" style="width:100%">
			<tbody><tr><td>
			<p>Hello <strong>{first_name},</strong></p>
			<p>Thank you for registering!</p>
			<p>Here is your login information:</p>
			<p>Login: <strong>{username}</strong><br />Password: <strong>{password}</strong></p>
			<p>Please click the following link to activate your account: <a href="{activate_link}">{activate_link}</a></p>
			<p><br />Thanks much,<br />Hifi Cashback Team</p>
			</td></tr></tbody>
		</table>
		</td></tr>
		<tr><td>
		<table border="0" cellpadding="0" cellspacing="0" style="width:100%">
			<tbody><tr><td style="text-align:center">
			<p><a href="#">RSS Feed</a> Copyright &copy; 2016 HifiCashback.com. All rights reserved.<br />
			<a href="#">Terms &amp; Conditions</a> &middot; <a href="#">Privacy Policy</a> &middot;</p>
			</td></tr></tbody>
		</table>
		</td></tr>
	</tbody>
</table>',
'2016-04-10 06:01:24'),

(3, 'english', 'activate2', 'Account activation email',
'<table border="0" cellpadding="0" cellspacing="0" style="width:550px; margin:auto; font-family:calibri; border:1px solid #f0f0f0;" align="center">
	<tbody>
		<tr><td style="border-bottom:1px solid #f0f0f0; padding:10px;">
		<p><img src="http://hificashback.com/images/hifi/logo.jpg" /></p>
		</td></tr>
		<tr><td style="padding:10px;">
		<table border="0" cellpadding="0" cellspacing="0" style="width:100%">
			<tbody><tr><td>
			<p>Hello <strong>{first_name},</strong></p>
			<p>Please click the following link to activate your account: <a href="{activate_link}" style="color:#0292ca; text-decoration:none;">{activate_link}</a></p>
			<p><br />Thanks much,<br />Hifi Cashback Team</p>
			</td></tr></tbody>
		</table>
		</td></tr>
		<tr><td style="background:#f9f9f9;">
		<table border="0" cellpadding="0" cellspacing="0" style="width:100%">
			<tbody><tr><td style="padding:10px; text-align:center; font-size:11px;">
			<p><a href="#" style="color:#0292ca; text-decoration:none;">RSS Feed</a> Copyright &copy; 2016 HifiCashback.com. All rights reserved.<br />
			<a href="#" style="color:#0292ca; text-decoration:none;">Terms &amp; Conditions</a> &middot; <a href="#" style="color:#0292ca; text-decoration:none;">Privacy Policy</a> &middot;</p>
			</td></tr></tbody>
		</table>
		</td></tr>
	</tbody>
</table>',
'2016-03-29 15:15:19'),

(4, 'english', 'forgot_password', 'Forgot password email',
'<table border="0" cellpadding="0" cellspacing="0" style="width:500px; font-family:calibri; border:1px solid #f0f0f0;" align="center">
	<tbody>
		<tr><td style="border-bottom:1px solid #f0f0f0; height:100px; padding:10px;">
		<p><img src="http://hificashback.com/images/hifi/logo.jpg" /></p>
		</td></tr>
		<tr><td style="padding:10px;">
		<table border="0" cellpadding="0" cellspacing="0" style="width:100%">
			<tbody><tr><td>
			<p>Hello <strong>{first_name},</strong></p>
			<p>As you requested, here is new password for your account:</p>
			<p>Login: <strong>{username}</strong><br />Password: <strong>{password}</strong></p>
			<p>Please <a href="{login_url}" style="color:#0292ca; text-decoration:none;">click here</a> to login in to your account.</p>
			<p><br />Thanks much,<br />Hifi Cashback Team</p>
			</td></tr></tbody>
		</table>
		</td></tr>
		<tr><td style="background:#f9f9f9;">
		<table border="0" cellpadding="0" cellspacing="0" style="width:100%">
			<tbody><tr><td style="padding:10px; text-align:center; font-size:12px;">
			<p><a href="#" style="color:#0292ca; text-decoration:none;">RSS Feed</a> Copyright &copy; 2016 HifiCashback.com. All rights reserved.<br />
			<a href="#" style="color:#0292ca; text-decoration:none;">Terms &amp; Conditions</a> &middot; <a href="#" style="color:#0292ca; text-decoration:none;">Privacy Policy</a> &middot;</p>
			</td></tr></tbody>
		</table>
		</td></tr>
	</tbody>
</table>',
'2016-03-29 15:17:40'),

(5, 'english', 'invite_friend', 'Invitation from your friend',
'<table align="center" border="0" cellpadding="0" cellspacing="0" style="width:550px">
	<tbody>
		<tr><td><p><img src="http://hificashback.com/images/hifi/logo.jpg" /></p></td></tr>
		<tr><td>
		<table border="0" cellpadding="0" cellspacing="0" style="width:100%">
			<tbody><tr><td>
			<p>Hello <strong>{friend_name},</strong></p>
			<p>Your friend <strong>{first_name}</strong> wants to invite you to register on our cashback site.</p>
			<p>Please <a href="{referral_link}">click here</a> to accept his invitation.</p>
			<p>&nbsp;</p>
			<p><strong>Message From Friend</strong> :{frnd_msg}</p>
			<br /><strong>Best Regards,<br />Hifi Cashback Team</strong>
			</td></tr></tbody>
		</table>
		</td></tr>
		<tr><td>
		<table border="0" cellpadding="0" cellspacing="0" style="width:100%">
			<tbody><tr><td style="text-align:center">
			<p><a href="#">RSS Feed</a> Copyright &copy; 2016 HifiCashback.com. All rights reserved.<br />
			<a href="#">Terms &amp; Conditions</a> &middot; <a href="#">Privacy Policy</a> &middot;</p>
			</td></tr></tbody>
		</table>
		</td></tr>
	</tbody>
</table>',
'2016-04-10 07:29:13'),

(6, 'english', 'newsletter', 'Offer Update',
'<table align="center" border="0" cellpadding="0" cellspacing="0" style="width:550px">
	<tbody>
		<tr><td><a href="https://hificashback.com/"><img src="http://hificashback.com/images/hifi/logo.jpg" /></a></td></tr>
		<tr><td>
		<table border="0" cellpadding="0" cellspacing="0" style="width:100%">
			<tbody>
				<tr><td>
				<p>Hello <strong>{first_name},</strong></p>
				<p>Grab it before it is over! Avail latest HIFICashback offers from HIFICashback.</p>
				</td></tr>
				<tr><td>&nbsp;</td></tr>
				<tr><td>{offer_detail}</td></tr>
				<tr><td><p><br />Best Regards,<br />Hifi Cashback Team</p></td></tr>
			</tbody>
		</table>
		</td></tr>
		<tr><td>
		<table border="0" cellpadding="0" cellspacing="0" style="width:100%">
			<tbody><tr><td style="text-align:center">
			<p><a href="#">RSS Feed</a> Copyright &copy; 2016 HifiCashback.com. All rights reserved.<br />
			<a href="#">Terms &amp; Conditions</a> &middot; <a href="#">Privacy Policy</a> &middot;</p>
			</td></tr></tbody>
		</table>
		</td></tr>
	</tbody>
</table>',
'2016-04-18 03:23:39');

-- Reset sequence
SELECT setval('cashbackengine_email_templates_template_id_seq', (SELECT MAX(template_id) FROM cashbackengine_email_templates));
