export interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  area: number; // 坪數
  room_type: string; // 房型 (如: 1房1廳1衛)
  property_type: 'apartment' | 'house' | 'studio' | 'office'; // 物件類型
  description: string;
  images: string[]; // 圖片 URL 陣列
  features: string[]; // 特色 (如: 電梯, 停車位, 陽台等)
  floor: number; // 樓層
  total_floors: number; // 總樓層
  age: number; // 屋齡 (年)
  direction: string; // 座向
  management_fee: number; // 管理費
  is_available: boolean; // 是否可租/售
  contact_phone: string; // 聯絡電話
  contact_name: string; // 聯絡人姓名
  created_at: string;
  updated_at: string;
}

export interface PropertyFormData {
  title: string;
  price: number;
  address: string;
  area: number;
  room_type: string;
  property_type: 'apartment' | 'house' | 'studio' | 'office';
  description: string;
  features: string[];
  floor: number;
  total_floors: number;
  age: number;
  direction: string;
  management_fee: number;
  contact_phone: string;
  contact_name: string;
}

export interface PropertyFilter {
  property_type?: string;
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  room_type?: string;
}
