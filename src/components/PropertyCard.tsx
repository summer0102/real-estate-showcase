'use client';

import { Property } from '@/types/property';
import { MapPin, Home, Ruler, Phone } from 'lucide-react';
import Link from 'next/link';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    // 假設輸入的價格已經是萬元為單位
    if (price >= 10000) {
      return `${(price / 10000).toFixed(0)}億`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}千萬`;
    } else if (price >= 100) {
      return `${Math.round(price)}萬`;
    } else if (price >= 10) {
      return `${price.toFixed(1)}萬`;
    }
    return `${price}萬`;
  };

  const getPropertyTypeText = (type: string) => {
    const types = {
      apartment: '公寓',
      house: '透天',
      studio: '套房',
      office: '辦公室'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <Link href={`/property/${property.id}`}>
      <div className="ig-card overflow-hidden group">
        {/* 圖片區域 */}
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                console.error('圖片載入失敗:', property.images[0]);
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">
              <Home size={48} />
            </div>
          )}
          <div className="hidden flex items-center justify-center h-full text-gray-300">
            <Home size={48} />
          </div>
          
          {/* 物件類型標籤 */}
          <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-medium">
            {getPropertyTypeText(property.property_type)}
          </div>
          
          {/* 價格標籤 */}
          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-bold">
            ${formatPrice(property.price)}
          </div>
        </div>

        {/* 內容區域 */}
        <div className="p-4">
          {/* 標題 */}
          <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2">
            {property.title}
          </h3>

          {/* 地址 */}
          <div className="flex items-center text-gray-500 mb-3">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{property.address}</span>
          </div>

          {/* 房型和坪數 */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded">
              <Home size={14} className="mr-1 text-gray-500" />
              <span className="text-xs">{property.room_type}</span>
            </div>
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded">
              <Ruler size={14} className="mr-1 text-gray-500" />
              <span className="text-xs">{property.area}坪</span>
            </div>
          </div>

          {/* 特色標籤 */}
          {property.features && property.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {property.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="text-gray-400 text-xs">+{property.features.length - 3}</span>
              )}
            </div>
          )}

          {/* 聯絡資訊 */}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
            <div className="flex items-center text-gray-500">
              <Phone size={12} className="mr-1" />
              <span className="text-xs">{property.contact_name}</span>
            </div>
            <div className="text-gray-500 text-xs">
              {property.floor}F/{property.total_floors}F
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
