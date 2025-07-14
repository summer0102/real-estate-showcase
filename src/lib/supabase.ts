import { createClient } from '@supabase/supabase-js';
import { Property } from '@/types/property';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 資料庫操作函數
export const propertyService = {
  // 獲取所有可用物件
  async getAllProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // 根據 ID 獲取單一物件
  async getPropertyById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('is_available', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // 找不到資料
      throw error;
    }
    return data;
  },

  // 篩選物件
  async getFilteredProperties(filters: {
    property_type?: string;
    min_price?: number;
    max_price?: number;
    min_area?: number;
    max_area?: number;
    room_type?: string;
  }): Promise<Property[]> {
    let query = supabase
      .from('properties')
      .select('*')
      .eq('is_available', true);

    if (filters.property_type) {
      query = query.eq('property_type', filters.property_type);
    }
    if (filters.min_price) {
      query = query.gte('price', filters.min_price);
    }
    if (filters.max_price) {
      query = query.lte('price', filters.max_price);
    }
    if (filters.min_area) {
      query = query.gte('area', filters.min_area);
    }
    if (filters.max_area) {
      query = query.lte('area', filters.max_area);
    }
    if (filters.room_type) {
      query = query.eq('room_type', filters.room_type);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // 新增物件 (管理員功能)
  async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 更新物件 (管理員功能)
  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 刪除物件 (管理員功能)
  async deleteProperty(id: string): Promise<void> {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // 上傳圖片
  async uploadImage(file: File, fileName: string): Promise<string> {
    const { error } = await supabase.storage
      .from('property-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName);

    return publicUrl;
  },

  // 刪除圖片
  async deleteImage(fileName: string): Promise<void> {
    const { error } = await supabase.storage
      .from('property-images')
      .remove([fileName]);
    
    if (error) throw error;
  }
};
