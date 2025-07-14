'use client';

import { useState, useEffect } from 'react';
import { Property, PropertyFilter as FilterType } from '@/types/property';
import { propertyService } from '@/lib/supabase';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilter from '@/components/PropertyFilter';
import { Search, Home as HomeIcon, Loader2 } from 'lucide-react';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 載入所有物件
  useEffect(() => {
    loadProperties();
  }, []);

  // 搜尋功能
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
  }, [searchTerm, properties]);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await propertyService.getAllProperties();
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      console.error('載入物件失敗:', err);
      setError('載入物件失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = async (filters: FilterType) => {
    try {
      setIsLoading(true);
      const data = await propertyService.getFilteredProperties(filters);
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      console.error('篩選物件失敗:', err);
      setError('篩選物件失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen ig-bg">

      {/* 標題區域 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto mobile-padding px-4 py-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-full shadow-lg">
              <HomeIcon className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold ig-gradient-text">
                RealEstate
              </h1>
              <p className="text-gray-500 text-sm mt-1">Discover your perfect home</p>
            </div>
          </div>

          {/* 搜尋欄 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 ig-input mobile-input text-gray-800 placeholder-gray-400 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 篩選和統計 */}
        <div className="flex items-center justify-between mb-6">
          <PropertyFilter onFilterChange={handleFilterChange} isLoading={isLoading} />
          <div className="text-sm text-gray-600">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="animate-spin" size={16} />
                <span>載入中...</span>
              </div>
            ) : (
              <span>共 {filteredProperties.length} 個物件</span>
            )}
          </div>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadProperties}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              重新載入
            </button>
          </div>
        )}

        {/* 物件列表 */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <HomeIcon className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-medium text-gray-600 mb-2">沒有找到符合條件的物件</h3>
            <p className="text-gray-500">請嘗試調整搜尋條件或篩選設定</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
