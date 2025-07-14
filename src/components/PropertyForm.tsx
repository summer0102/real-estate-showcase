'use client';

import { useState, useEffect } from 'react';
import { Property, PropertyFormData } from '@/types/property';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: PropertyFormData & { images: string[] }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PropertyForm({ property, onSubmit, onCancel, isLoading }: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    price: 0,
    address: '',
    area: 0,
    room_type: '',
    property_type: 'apartment',
    description: '',
    features: [],
    floor: 1,
    total_floors: 1,
    age: 0,
    direction: '',
    management_fee: 0,
    contact_phone: '',
    contact_name: '',
  });

  const [newFeature, setNewFeature] = useState('');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        price: property.price,
        address: property.address,
        area: property.area,
        room_type: property.room_type,
        property_type: property.property_type,
        description: property.description,
        features: property.features || [],
        floor: property.floor,
        total_floors: property.total_floors,
        age: property.age,
        direction: property.direction,
        management_fee: property.management_fee,
        contact_phone: property.contact_phone,
        contact_name: property.contact_name,
      });
      setImages(property.images || []);
    }
  }, [property]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    console.log('Input change:', { name, value, type }); // 調試用
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // 專門處理地址輸入的函數
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Address change:', value); // 調試用
    setFormData(prev => ({
      ...prev,
      address: value,
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...formData, images });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {property ? '編輯物件' : '新增物件'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          disabled={isLoading}
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本資訊 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              物件標題 *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入物件標題"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              價格 (萬元) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入價格 (例: 888 代表 888萬)"
            />
            <p className="text-xs text-gray-500 mt-1">
              請輸入萬元為單位的價格，例如：888 代表 888萬元
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            地址 *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address || ''}
            onChange={handleAddressChange}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入完整地址"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              坪數 *
            </label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              required
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="坪數"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              房型 *
            </label>
            <input
              type="text"
              name="room_type"
              value={formData.room_type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="如: 2房1廳1衛"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              物件類型 *
            </label>
            <select
              name="property_type"
              value={formData.property_type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="apartment">公寓</option>
              <option value="house">透天</option>
              <option value="studio">套房</option>
              <option value="office">辦公室</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              樓層 *
            </label>
            <input
              type="number"
              name="floor"
              value={formData.floor}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              總樓層 *
            </label>
            <input
              type="number"
              name="total_floors"
              value={formData.total_floors}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              屋齡 (年) *
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              座向
            </label>
            <input
              type="text"
              name="direction"
              value={formData.direction}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="如: 南向"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            管理費 (元/月)
          </label>
          <input
            type="number"
            name="management_fee"
            value={formData.management_fee}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="管理費"
          />
        </div>

        {/* 特色標籤 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            物件特色
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="輸入特色標籤"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <Trash2 size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            物件描述
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入物件詳細描述..."
          />
        </div>

        {/* 圖片上傳 */}
        <ImageUpload
          images={images}
          onImagesChange={setImages}
          disabled={isLoading}
        />

        {/* 聯絡資訊 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              聯絡人姓名 *
            </label>
            <input
              type="text"
              name="contact_name"
              value={formData.contact_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="聯絡人姓名"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              聯絡電話 *
            </label>
            <input
              type="tel"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="聯絡電話"
            />
          </div>
        </div>

        {/* 提交按鈕 */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Save className="mr-2" size={20} />
            {isLoading ? '儲存中...' : '儲存'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
