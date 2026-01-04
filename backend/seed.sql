-- Seed data for FarmInvest database
USE farminvest_db;

-- Insert sample investments (Sri Lankan farmers)
INSERT INTO investments (farmer_name, amount, crop) VALUES
('සිරිල් පෙරේරා', 50000.00, 'Rice'),
('නිමල් ප්‍රනාන්දු', 75000.50, 'Corn'),
('කමලා විජේසිංහ', 32000.00, 'Tea'),
('සුනිල් රත්නායක', 100000.00, 'Coconut'),
('මාලිනි සිල්වා', 45000.75, 'Vegetables'),
('ප්‍රියන්ත ජයවර්ධන', 68000.00, 'Cinnamon'),
('රුවන් බණ්ඩාර', 82000.00, 'Coffee'),
('චමිල් ගුණසේකර', 55000.25, 'Sugarcane'),
('තිලකා මේන්දිස්', 91000.00, 'Potatoes'),
('අනුර දිසානායක', 42000.50, 'Tomatoes');

-- Verify insertion
SELECT COUNT(*) as total_investments FROM investments;
SELECT * FROM investments ORDER BY created_at DESC;
