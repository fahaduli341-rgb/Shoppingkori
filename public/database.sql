-- =====================================================================
-- DATABASE NAME: shopping_kori_db
-- APPLICATION: Shopping Kori (Multi-vendor E-Commerce Marketplace)
-- COMPATIBILITY: MySQL 5.7+ / 8.0+ / MariaDB / PostgreSQL
-- ENCODING: UTF-8 Unicode (utf8mb4)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `shopping_kori_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `shopping_kori_db`;

-- Drop existing tables in reverse foreign key order if re-importing
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `vendors`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `store_settings`;
DROP TABLE IF EXISTS `admin_users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. ADMIN USERS TABLE (অ্যাডমিন ও ম্যানেজার একাউন্ট)
-- ---------------------------------------------------------------------
CREATE TABLE `admin_users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `role` ENUM('Super Admin', 'Admin', 'Order Manager', 'Support Staff') DEFAULT 'Admin',
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `last_login` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. CUSTOMERS TABLE (কাস্টমার একাউন্ট ও ডেলিভারি প্রোফাইল)
-- ---------------------------------------------------------------------
CREATE TABLE `customers` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(20) NOT NULL UNIQUE,
  `email` VARCHAR(150) NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `address` TEXT NULL,
  `division` VARCHAR(50) DEFAULT 'Dhaka',
  `district` VARCHAR(50) DEFAULT 'Dhaka City',
  `total_orders` INT DEFAULT 0,
  `status` ENUM('active', 'suspended') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_customer_phone` (`phone`),
  INDEX `idx_customer_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. CATEGORIES & SUB-CATEGORIES (ক্যাটাগরি সমূহ)
-- ---------------------------------------------------------------------
CREATE TABLE `categories` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name_en` VARCHAR(100) NOT NULL,
  `name_bn` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `icon_name` VARCHAR(50) DEFAULT 'Package',
  `image_url` TEXT NULL,
  `subcategories` JSON NULL COMMENT 'Array of subcategory names in JSON',
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. VENDORS / MERCHANTS TABLE (মার্কেটপ্লেস বিক্রেতা)
-- ---------------------------------------------------------------------
CREATE TABLE `vendors` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `shop_name` VARCHAR(150) NOT NULL,
  `owner_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(20) NOT NULL UNIQUE,
  `email` VARCHAR(150) NULL,
  `address` TEXT NULL,
  `rating` DECIMAL(2,1) DEFAULT 4.8,
  `total_sales` DECIMAL(12,2) DEFAULT 0.00,
  `is_verified` BOOLEAN DEFAULT TRUE,
  `status` ENUM('active', 'pending', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. PRODUCTS TABLE (পণ্যসমূহ)
-- ---------------------------------------------------------------------
CREATE TABLE `products` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `brand` VARCHAR(100) NULL,
  `category_id` VARCHAR(64) NOT NULL,
  `sub_category` VARCHAR(100) NULL,
  `vendor_id` VARCHAR(64) NULL,
  `vendor_name` VARCHAR(150) NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `original_price` DECIMAL(10,2) NULL,
  `cost_price` DECIMAL(10,2) NULL,
  `stock` INT NOT NULL DEFAULT 10,
  `unit` VARCHAR(50) DEFAULT '1 pc',
  `description` TEXT NULL,
  `image_url` TEXT NOT NULL,
  `gallery_images` JSON NULL,
  `available_sizes` VARCHAR(255) NULL COMMENT 'Comma separated: M, L, XL',
  `available_colors` VARCHAR(255) NULL COMMENT 'Comma separated: Black, Blue, Olive',
  `is_flash_sale` BOOLEAN DEFAULT FALSE,
  `tag` ENUM('NEW', 'BEST SELLER', 'HOT', 'EXCLUSIVE') NULL,
  `in_stock` BOOLEAN DEFAULT TRUE,
  `rating` DECIMAL(2,1) DEFAULT 4.9,
  `review_count` INT DEFAULT 12,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_product_category` (`category_id`),
  INDEX `idx_product_vendor` (`vendor_id`),
  INDEX `idx_product_price` (`price`),
  CONSTRAINT `fk_product_vendor` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. ORDERS TABLE (অর্ডার ও কুরিয়ার ট্র্যাকিং)
-- ---------------------------------------------------------------------
CREATE TABLE `orders` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `customer_id` VARCHAR(64) NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150) NULL,
  `division` VARCHAR(50) NOT NULL DEFAULT 'Dhaka',
  `district` VARCHAR(50) NOT NULL,
  `address` TEXT NOT NULL,
  `delivery_zone` ENUM('Inside Dhaka', 'Outside Dhaka') NOT NULL DEFAULT 'Inside Dhaka',
  `subtotal` DECIMAL(10,2) NOT NULL,
  `shipping_cost` DECIMAL(10,2) NOT NULL DEFAULT 60.00,
  `discount_amount` DECIMAL(10,2) DEFAULT 0.00,
  `coupon_code` VARCHAR(50) NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `payment_method` ENUM('Cash on Delivery', 'bKash', 'Nagad', 'Rocket', 'CellFin', 'Card') NOT NULL DEFAULT 'Cash on Delivery',
  `payment_status` ENUM('Unpaid', 'Paid', 'Refunded') NOT NULL DEFAULT 'Unpaid',
  `trx_id` VARCHAR(100) NULL COMMENT 'Payment Transaction ID if bKash/Nagad',
  `sender_phone` VARCHAR(20) NULL COMMENT 'Customer Mobile Number used to send money',
  `status` ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `courier` ENUM('Steadfast', 'Pathao', 'RedX', 'Paperfly', 'eCourier') NULL,
  `consignment_id` VARCHAR(100) NULL COMMENT 'Courier Consignment/Booking ID',
  `tracking_code` VARCHAR(100) NULL COMMENT 'Courier Tracking Link/Code',
  `estimated_delivery` VARCHAR(100) DEFAULT '24 - 48 Hours',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_order_phone` (`phone`),
  INDEX `idx_order_status` (`status`),
  INDEX `idx_order_customer` (`customer_id`),
  CONSTRAINT `fk_order_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. ORDER ITEMS TABLE (অর্ডারে অন্তর্ভুক্ত পণ্যসমূহ)
-- ---------------------------------------------------------------------
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(64) NOT NULL,
  `product_id` VARCHAR(64) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `selected_size` VARCHAR(50) NULL,
  `selected_color` VARCHAR(50) NULL,
  `image_url` TEXT NULL,
  `vendor_name` VARCHAR(150) NULL,
  CONSTRAINT `fk_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. COUPONS TABLE (কুপন ডিসকাউন্ট)
-- ---------------------------------------------------------------------
CREATE TABLE `coupons` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `discount_amount` DECIMAL(10,2) NOT NULL,
  `min_order_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `is_active` BOOLEAN DEFAULT TRUE,
  `usage_limit` INT DEFAULT 500,
  `times_used` INT DEFAULT 0,
  `expiry_date` DATE NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. STORE SETTINGS TABLE (দোকানের সম্পূর্ণ কনফিগারেশন)
-- ---------------------------------------------------------------------
CREATE TABLE `store_settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `store_name` VARCHAR(150) NOT NULL DEFAULT 'Shopping Kori',
  `tagline` VARCHAR(255) DEFAULT 'ঘরে বসে, বাজার করি',
  `phone` VARCHAR(30) DEFAULT '01880816999',
  `whatsapp_number` VARCHAR(30) DEFAULT '01880816999',
  `email` VARCHAR(150) DEFAULT 'support@shoppingkori.com',
  `address` TEXT,
  `announcement` TEXT,
  `delivery_inside_dhaka` DECIMAL(10,2) DEFAULT 60.00,
  `delivery_outside_dhaka` DECIMAL(10,2) DEFAULT 120.00,
  `enable_free_shipping` BOOLEAN DEFAULT TRUE,
  `free_shipping_threshold` DECIMAL(10,2) DEFAULT 1500.00,
  `bkash_number` VARCHAR(30) DEFAULT '01880816999',
  `bkash_type` ENUM('Personal', 'Merchant') DEFAULT 'Personal',
  `nagad_number` VARCHAR(30) DEFAULT '01880816999',
  `nagad_type` ENUM('Personal', 'Merchant') DEFAULT 'Personal',
  `rocket_number` VARCHAR(30) DEFAULT '01880816999',
  `rocket_type` ENUM('Personal', 'Merchant') DEFAULT 'Personal',
  `cellfin_number` VARCHAR(30) DEFAULT '01880816999',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- SEED DATA INSERTION (প্রাথমিক প্রয়োজনীয় ডেটা)
-- =====================================================================

-- 1. Default Admin Credentials (Email: admin@shoppingkori.com / Pass: admin123)
INSERT INTO `admin_users` (`id`, `username`, `email`, `password_hash`, `full_name`, `role`, `status`)
VALUES 
('ADM-01', 'admin', 'admin@shoppingkori.com', 'admin123', 'System Administrator', 'Super Admin', 'active');

-- 2. Store Settings
INSERT INTO `store_settings` (
  `id`, `store_name`, `tagline`, `phone`, `whatsapp_number`, `email`, 
  `address`, `announcement`, `delivery_inside_dhaka`, `delivery_outside_dhaka`, 
  `enable_free_shipping`, `free_shipping_threshold`, `bkash_number`, `nagad_number`
) VALUES (
  1, 'Shopping Kori', 'ঘরে বসে, বাজার করি', '01880816999', '01880816999', 'support@shoppingkori.com', 
  'House #12, Road #4, Dhanmondi, Dhaka 1205, Bangladesh', 
  '🎉 সারাদেশে ক্যাশ অন ডেলিভারি এবং ১৫০০ টাকার কেনাকাটায় ফ্রি ডেলিভারি!', 
  60.00, 120.00, TRUE, 1500.00, '01880816999', '01880816999'
) ON DUPLICATE KEY UPDATE `updated_at` = CURRENT_TIMESTAMP;

-- 3. Categories
INSERT INTO `categories` (`id`, `name_en`, `name_bn`, `slug`, `icon_name`, `subcategories`, `display_order`)
VALUES 
('Fashion', 'Fashion & Clothing', 'ফ্যাশন ও পোশাক', 'fashion', 'Shirt', '["Men\'s Wear", "Women\'s Wear", "Footwear", "Watches & Jewelry"]', 1),
('Electronics', 'Electronics & Gadgets', 'ইলেকট্রনিক্স ও গ্যাজেট', 'electronics', 'Smartphone', '["Mobile & Gadgets", "Home Appliances", "Audio & Speakers", "Smart Watches"]', 2),
('Home & Living', 'Home & Living', 'হোম ও লিভিং', 'home-living', 'Home', '["Kitchenware", "Bedding & Linen", "Home Decor", "Cleaning Tools"]', 3),
('Baby & Mom', 'Baby & Mom Care', 'বেবি ও মম কেয়ার', 'baby-mom', 'Baby', '["Diapers & Wipes", "Baby Care & Skincare", "Toys & Learning", "Feeding Essentials"]', 4),
('Beauty', 'Beauty & Personal Care', 'বিউটি ও কেয়ার', 'beauty', 'Sparkles', '["Skincare", "Haircare", "Fragrance & Perfume", "Makeup & Cosmetics"]', 5),
('Groceries', 'Groceries & Essentials', 'মুদি ও নিত্যপণ্য', 'groceries', 'ShoppingBag', '["Pure Spices & Mustard Oil", "Dry Food & Rice", "Tea & Coffee", "Healthy Snacks"]', 6);

-- 4. Initial Vendors
INSERT INTO `vendors` (`id`, `shop_name`, `owner_name`, `phone`, `email`, `address`, `rating`, `status`)
VALUES 
('VND-01', 'Dhaka Gadget Hub', 'Rafiqul Islam', '01711223344', 'gadgethub@shoppingkori.com', 'Motijheel, Dhaka', 4.9, 'active'),
('VND-02', 'Heritage Handloom Silk', 'Nasreen Sultana', '01822334455', 'heritage@shoppingkori.com', 'Mirpur Banarasi Palli, Dhaka', 4.8, 'active'),
('VND-03', 'Pure Bengal Organic Agro', 'Kazi Mahfuz', '01933445566', 'agro@shoppingkori.com', 'Bogura, Bangladesh', 5.0, 'active');

-- 5. Promotional Coupons
INSERT INTO `coupons` (`id`, `code`, `discount_amount`, `min_order_amount`, `is_active`)
VALUES 
('CPN-1', 'BAZAR50', 50.00, 500.00, TRUE),
('CPN-2', 'EID100', 100.00, 1000.00, TRUE),
('CPN-3', 'SPECIAL200', 200.00, 2000.00, TRUE);

-- 6. Demo Customer Account (Mobile: 01880816999 / Pass: 1234)
INSERT INTO `customers` (`id`, `name`, `phone`, `email`, `password_hash`, `address`, `division`, `district`)
VALUES 
('CUST-1001', 'তানভীর আহমেদ', '01880816999', 'tanvir@gmail.com', '1234', 'বাসা-২৪, রোড-৩, ধানমন্ডি', 'Dhaka', 'Dhaka City');

-- 7. Sample Products
INSERT INTO `products` (
  `id`, `name`, `brand`, `category_id`, `sub_category`, `vendor_id`, `vendor_name`, 
  `price`, `original_price`, `stock`, `unit`, `description`, `image_url`, `available_sizes`, `available_colors`, `tag`, `in_stock`
) VALUES 
('PRD-101', 'প্রিমিয়াম কটন পাঞ্জাবি (Classic Embroidered Panjabi)', 'Aarong Fabric', 'Fashion', 'Men\'s Wear', 'VND-02', 'Heritage Handloom Silk', 1450.00, 1850.00, 25, '1 pc', '১০০% পিওর কটন ফেব্রিক দিয়ে তৈরি প্রিমিয়াম কোয়ালিটি পাঞ্জাবি। আরামদায়ক ও টেকসই সেলাই।', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80', 'M, L, XL, XXL', 'White, Navy, Olive', 'BEST SELLER', TRUE),

('PRD-102', 'ওয়্যারলেস নয়েজ ক্যানসেলিং ইয়ারবাডস (ANC TWS)', 'SoundWave BD', 'Electronics', 'Audio & Speakers', 'VND-01', 'Dhaka Gadget Hub', 1650.00, 2200.00, 40, '1 set', 'অ্যাক্টিভ নয়েজ ক্যানসেলেশন ও ডিপ ব্যাস সহ প্রফেশনাল ব্লুটুথ ৫.৩ ইয়ারফোন। ব্যাটারি ব্যাকআপ ৩৬ ঘণ্টা।', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80', NULL, 'Matte Black, Pearl White', 'HOT', TRUE),

('PRD-103', 'খাটি সরিষার তেল (Wood Pressed Mustard Oil 1L)', 'Pure Agro', 'Groceries', 'Pure Spices & Mustard Oil', 'VND-03', 'Pure Bengal Organic Agro', 360.00, 420.00, 100, '1 Litre', 'গ্রামের ঘানি ভাঙা ১০০% খাঁটি ঝাঁঝালো সরিষার তেল। কোনো প্রকার কেমিক্যাল বা ভেজাল নেই।', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', NULL, NULL, 'BEST SELLER', TRUE),

('PRD-104', 'স্মার্ট ফিটনেস ওয়াচ (AMOLED Display Smartwatch)', 'ApexTech', 'Electronics', 'Smart Watches', 'VND-01', 'Dhaka Gadget Hub', 2450.00, 3200.00, 15, '1 pc', 'হার্ট রেট, SpO2, স্লিপ ট্র্যাকার এবং ব্লুটুথ কলিং সুবিধা সহ ওয়াটারপ্রুফ স্মার্টওয়াচ।', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', NULL, 'Midnight Black, Silver Grey', 'EXCLUSIVE', TRUE),

('PRD-105', 'নন-স্টিক সিরামিক কুকওয়্যার সেট (5 Pcs Cookware Set)', 'ChefMaster', 'Home & Living', 'Kitchenware', 'VND-01', 'Dhaka Gadget Hub', 2850.00, 3600.00, 12, '5 Pcs Set', 'অল্প তেলে স্বাস্থ্যকর রান্নার জন্য প্রিমিয়াম নন-স্টিক গ্রানাইট কোটিং কুকিং সেট। ইন্ডাকশন সাপোর্টেড।', 'https://images.unsplash.com/photo-1584990347449-39908cf67417?auto=format&fit=crop&w=600&q=80', NULL, 'Granite Grey, Maroon', 'NEW', TRUE);

-- 8. Sample Order with Item
INSERT INTO `orders` (
  `id`, `customer_id`, `customer_name`, `phone`, `email`, `division`, `district`, `address`, 
  `delivery_zone`, `subtotal`, `shipping_cost`, `total_amount`, `payment_method`, `payment_status`, 
  `status`, `courier`, `consignment_id`, `tracking_code`, `estimated_delivery`
) VALUES (
  'ORD-829104', 'CUST-1001', 'তানভীর আহমেদ', '01880816999', 'tanvir@gmail.com', 'Dhaka', 'Dhaka City', 
  'বাসা-২৪, রোড-৩, ধানমন্ডি', 'Inside Dhaka', 1450.00, 60.00, 1510.00, 'Cash on Delivery', 'Unpaid', 
  'Confirmed', 'Steadfast', 'SF-829104-BD', 'STDF829104', '24 - 48 Hours'
);

INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `price`, `quantity`, `selected_size`, `selected_color`, `image_url`)
VALUES ('ORD-829104', 'PRD-101', 'প্রিমিয়াম কটন পাঞ্জাবি', 1450.00, 1, 'L', 'White', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80');

-- =====================================================================
-- END OF DATABASE SCRIPT
-- =====================================================================
