-- =========================================================================
-- CHAH FOUNDATION — FIX FOR OUR ENDEAVOUR IMPACT METRICS
-- Execute this script in phpMyAdmin / MySQL to restore the 4 impact metrics
-- =========================================================================

-- 1. Remove rogue cron-generated metrics
DELETE FROM `impact_metrics` WHERE `metric_name` IN ('Funds Raised', 'Active Donors');

-- 2. Insert or update the 4 core Endeavour impact metrics
INSERT INTO `impact_metrics` (`id`, `metric_name`, `metric_value`, `icon`, `created_at`, `updated_at`)
VALUES 
  (1, 'Meals Served', '2.5M+', 'Utensils', NOW(), NOW()),
  (2, 'People Reached', '10,000+', 'Users', NOW(), NOW()),
  (3, 'Schools & Communities', '172+', 'School', NOW(), NOW()),
  (4, 'Healthcare Camps', '350+', 'Hospital', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  `metric_name` = VALUES(`metric_name`),
  `metric_value` = VALUES(`metric_value`),
  `icon` = VALUES(`icon`),
  `updated_at` = NOW();

-- 3. Upsert Section Settings for Our Endeavour
INSERT INTO `settings` (`setting_key`, `setting_value`, `created_at`, `updated_at`)
VALUES (
  'our_endeavour_section',
  '{"badge":"OUR IMPACT","heading":"Our Endeavour As NGO","description":"At our core, we believe a food-secure society helps unlock its true potential. We are not only nourishing bodies but also opening doors to better education, health and prosperity for fellow citizens. Together, we can pave the way for a future where every vulnerable has an equal chance to thrive.","cta_text":"Join Our Cause","cta_link":"/donate","updated_as_on":"04/10/2026"}',
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE 
  `setting_value` = VALUES(`setting_value`),
  `updated_at` = NOW();
