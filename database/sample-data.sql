-- 示例資料 - 用於測試系統功能
-- 執行此檔案前請確保已先執行 schema.sql

-- 插入示例物件資料
INSERT INTO properties (
  title,
  price,
  address,
  area,
  room_type,
  property_type,
  description,
  features,
  floor,
  total_floors,
  age,
  direction,
  management_fee,
  contact_phone,
  contact_name,
  images
) VALUES 
(
  '台北市信義區豪華公寓',
  25000,
  '台北市信義區信義路五段100號',
  25.5,
  '2房1廳1衛',
  'apartment',
  '位於信義區精華地段，交通便利，生活機能完善。室內裝潢精美，採光良好，適合小家庭或上班族居住。',
  ARRAY['電梯', '停車位', '陽台', '冷氣', '洗衣機', '冰箱'],
  8,
  15,
  5,
  '南向',
  3000,
  '0912-345-678',
  '王小明',
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1560449752-2dd9b55c3d0e?w=800']
),
(
  '新北市板橋區溫馨套房',
  12000,
  '新北市板橋區中山路二段50號',
  8.0,
  '套房',
  'studio',
  '近捷運站，生活便利。套房內設備齊全，適合學生或單身上班族。',
  ARRAY['近捷運', '家具', '網路', '冷氣'],
  3,
  5,
  10,
  '東向',
  500,
  '0923-456-789',
  '李小華',
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800']
),
(
  '桃園市中壢區透天別墅',
  45000,
  '桃園市中壢區中正路300號',
  45.0,
  '4房2廳3衛',
  'house',
  '獨棟透天別墅，前後院，停車方便。適合大家庭居住，環境清幽。',
  ARRAY['獨立車庫', '前後院', '頂樓加蓋', '社區管理'],
  1,
  3,
  8,
  '南向',
  0,
  '0934-567-890',
  '張大偉',
  ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800']
),
(
  '台中市西屯區商辦空間',
  35000,
  '台中市西屯區台灣大道三段200號',
  30.0,
  '開放式',
  'office',
  '位於台灣大道精華商圈，適合各種商業用途。交通便利，周邊商業機能完善。',
  ARRAY['電梯', '中央空調', '網路', '會議室'],
  12,
  20,
  3,
  '西向',
  5000,
  '0945-678-901',
  '陳經理',
  ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800']
),
(
  '高雄市前金區市中心公寓',
  18000,
  '高雄市前金區中正四路150號',
  20.0,
  '2房1廳1衛',
  'apartment',
  '位於高雄市中心，生活機能佳，交通便利。近愛河，環境優美。',
  ARRAY['近愛河', '電梯', '陽台', '冷氣'],
  6,
  10,
  12,
  '北向',
  2000,
  '0956-789-012',
  '林小姐',
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800']
);

-- 驗證資料插入
SELECT 
  title,
  price,
  property_type,
  room_type,
  area,
  address
FROM properties 
ORDER BY created_at DESC;
