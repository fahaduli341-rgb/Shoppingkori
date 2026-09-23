-- ====================================================================
-- Shopping Kori (শপিং করি) - Production Database Schema (SQL)
-- Target RDBMS: PostgreSQL 14+ / MySQL 8.0+ Compatible
-- Description: E-Commerce & Multi-Vendor Marketplace for Bangladesh
-- ====================================================================

-- 1. EXTENSIONS (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE order_status_enum AS ENUM (
        'Pending', 'Processing', 'Confirmed', 'Packaging', 
        'In Transit', 'Shipped', 'Out For Delivery', 'Delivered', 
        'Cancelled', 'Returned'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE courier_provider_enum AS ENUM (
        'Steadfast', 'Pathao', 'Paperfly', 'RedX', 'Sundarban', 'SA Paribahan', 'Internal Delivery'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. STORE SETTINGS & CONTACT CONFIGURATION
CREATE TABLE IF NOT EXISTS store_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'main_settings',
    store_name VARCHAR(150) NOT NULL DEFAULT 'Shopping Kori',
    tagline VARCHAR(255) DEFAULT 'Everyday Essentials Across Bangladesh',
    whatsapp_number VARCHAR(30) NOT NULL DEFAULT '+8801700000000',
    phone VARCHAR(30) NOT NULL DEFAULT '+8801700000000',
    email VARCHAR(100) NOT NULL DEFAULT 'contact@shoppingkori.com',
    bkash_number VARCHAR(30) DEFAULT '01700000000',
    nagad_number VARCHAR(30) DEFAULT '01800000000',
    address TEXT NOT NULL DEFAULT 'House 14, Road 5, Block C, Banani, Dhaka-1213, Bangladesh',
    inside_dhaka_delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 60.00,
    outside_dhaka_delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 120.00,
    free_delivery_threshold NUMERIC(10, 2) DEFAULT 1500.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'BDT',
    currency_symbol VARCHAR(10) NOT NULL DEFAULT '৳',
    banner_notice TEXT DEFAULT '🚚 সারা দেশে ৪৮ ঘণ্টার মধ্যে দ্রুত হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি!',
    admin_password_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. MARKETPLACE VENDORS / MERCHANTS
CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(100) PRIMARY KEY,
    store_name VARCHAR(150) NOT NULL,
    shop_name VARCHAR(150) NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(100),
    city VARCHAR(100) DEFAULT 'Dhaka',
    address TEXT,
    commission_rate NUMERIC(5, 2) DEFAULT 10.00, -- e.g. 10.00%
    status VARCHAR(50) DEFAULT 'Active', -- Active / Suspended
    rating NUMERIC(3, 2) DEFAULT 4.90,
    is_verified BOOLEAN DEFAULT TRUE,
    products_count INT DEFAULT 0,
    total_sales NUMERIC(12, 2) DEFAULT 0.00,
    joined_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PRODUCTS CATALOG
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(150) NOT NULL DEFAULT 'Shopping Kori',
    category VARCHAR(100) NOT NULL, -- e.g. Home & Living, Electronics, Groceries, Fashion, Beauty, Gadgets
    sub_category VARCHAR(100),
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    discount_percent INT DEFAULT 0,
    stock INT NOT NULL DEFAULT 10,
    in_stock BOOLEAN DEFAULT TRUE,
    unit VARCHAR(50) DEFAULT '1 pc',
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INT DEFAULT 1,
    description TEXT,
    image_url TEXT NOT NULL,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    sizes JSONB DEFAULT '[]'::jsonb,
    colors JSONB DEFAULT '[]'::jsonb,
    tag VARCHAR(50), -- 'NEW', 'BEST SELLER', 'HOT', 'EXCLUSIVE'
    featured BOOLEAN DEFAULT FALSE,
    is_special_offer BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_flash_sale BOOLEAN DEFAULT FALSE,
    vendor_id VARCHAR(100) REFERENCES vendors(id) ON DELETE SET NULL,
    vendor_name VARCHAR(150) DEFAULT 'Shopping Kori Official',
    sku VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. DISCOUNT COUPONS & PROMO VOUCHERS
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(100) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage', -- 'percentage' or 'fixed'
    discount_value NUMERIC(10, 2) NOT NULL,
    min_spend NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    max_discount NUMERIC(10, 2),
    usage_limit INT DEFAULT 1000,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    description VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    alternative_phone VARCHAR(30),
    email VARCHAR(100),
    district VARCHAR(100) NOT NULL DEFAULT 'Dhaka',
    thana VARCHAR(100),
    address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Cash on Delivery', -- COD, bKash, Nagad
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Unpaid', -- Unpaid, Paid, Partial
    transaction_id VARCHAR(100),
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    coupon_code VARCHAR(50),
    status order_status_enum NOT NULL DEFAULT 'Pending',
    courier courier_provider_enum DEFAULT 'Steadfast',
    tracking_code VARCHAR(100),
    consignment_id VARCHAR(100),
    customer_risk_score VARCHAR(50) DEFAULT 'New Customer', -- 'Verified (High Trust)', 'New Customer', 'High Return Risk'
    admin_notes TEXT,
    order_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ORDER ITEMS (LINE ITEMS)
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_price NUMERIC(10, 2) NOT NULL,
    size VARCHAR(50),
    color VARCHAR(50),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. ADMIN ALLOWLIST & USERS
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Super Admin',
    name VARCHAR(150) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. INDEXES FOR HIGH QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- 11. INITIAL SEED DATA
INSERT INTO admin_users (id, email, role, name)
VALUES 
    ('admin-1', 'fahad1e1e1@gmail.com', 'Super Admin', 'Fahad (Store Owner)'),
    ('admin-2', 'fahad1wo8@gmail.com', 'Super Admin', 'Fahad (Merchant Owner)')
ON CONFLICT (email) DO NOTHING;

INSERT INTO coupons (id, code, discount_type, discount_value, min_spend, max_discount, is_active, description)
VALUES 
    ('coupon-1', 'BAZAR50', 'fixed', 50.00, 500.00, 50.00, true, '৳৫০ ফ্ল্যাট ছাড় যেকোনো অর্ডারে'),
    ('coupon-2', 'EID100', 'fixed', 100.00, 1000.00, 100.00, true, '৳১০০ বিশেষ ছাড় উৎসব অফার'),
    ('coupon-3', 'FREESHIP', 'fixed', 60.00, 1200.00, 120.00, true, 'ফ্রি ডেলিভারি অফার')
ON CONFLICT (code) DO NOTHING;
