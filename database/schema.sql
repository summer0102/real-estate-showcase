-- 建立房屋物件資料表
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  address TEXT NOT NULL,
  area DECIMAL(10,2) NOT NULL, -- 坪數
  room_type VARCHAR(50) NOT NULL, -- 房型
  property_type VARCHAR(20) NOT NULL CHECK (property_type IN ('apartment', 'house', 'studio', 'office')),
  description TEXT,
  images TEXT[] DEFAULT '{}', -- 圖片 URL 陣列
  features TEXT[] DEFAULT '{}', -- 特色陣列
  floor INTEGER,
  total_floors INTEGER,
  age INTEGER, -- 屋齡
  direction VARCHAR(10), -- 座向
  management_fee INTEGER DEFAULT 0, -- 管理費
  is_available BOOLEAN DEFAULT true,
  contact_phone VARCHAR(20),
  contact_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立更新時間觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON properties 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 建立索引以提升查詢效能
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_area ON properties(area);
CREATE INDEX idx_properties_is_available ON properties(is_available);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);

-- 建立 RLS (Row Level Security) 政策
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 允許所有人讀取可用的物件
CREATE POLICY "Allow public read access to available properties" ON properties
    FOR SELECT USING (is_available = true);

-- 只允許認證用戶進行 CUD 操作 (後續可以改為特定管理員)
CREATE POLICY "Allow authenticated users to insert" ON properties
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON properties
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON properties
    FOR DELETE USING (auth.role() = 'authenticated');

-- 建立儲存桶用於圖片上傳
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- 設定儲存桶政策
CREATE POLICY "Allow public read access to property images" ON storage.objects
    FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Allow authenticated users to upload property images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete property images" ON storage.objects
    FOR DELETE USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');
