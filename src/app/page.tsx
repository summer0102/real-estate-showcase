'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { propertyService } from '@/lib/supabase';
import PropertyCard from '@/components/PropertyCard';
import { Home as HomeIcon } from 'lucide-react';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 載入所有物件
  useEffect(() => {
    loadProperties();
  }, []);



  const loadProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await propertyService.getAllProperties();
      setProperties(data);
    } catch (err) {
      console.error('載入物件失敗:', err);
      setError('載入物件失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Instagram 風格內容 */}
      <div className="max-w-md mx-auto">

        {/* 錯誤訊息 */}
        {error && (
          <div className="mx-4 my-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={loadProperties}
              className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
            >
              重新載入
            </button>
          </div>
        )}

        {/* Instagram 風格物件列表 */}
        {isLoading ? (
          <div className="space-y-0">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white animate-pulse">
                <div className="h-80 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 px-4">
            <HomeIcon className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到物件</h3>
            <p className="text-gray-500 text-sm">目前沒有可用的物件</p>
          </div>
        ) : (
          <div className="space-y-0">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
