'use client';

import { Property } from '@/types/property';
import { MapPin, Home, Ruler, Phone } from 'lucide-react';
import Link from 'next/link';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${(price / 10000).toFixed(1)}萬`;
    }
    return price.toLocaleString();
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
      <div className="warm-card overflow-hidden group">
        {/* 圖片區域 */}
        <div className="relative h-52 bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
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
            <div className="flex items-center justify-center h-full text-orange-300">
              <Home size={48} />
            </div>
          )}
          <div className="hidden flex items-center justify-center h-full text-orange-300">
            <Home size={48} />
          </div>
          
          {/* 物件類型標籤 */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
            {getPropertyTypeText(property.property_type)}
          </div>
          
          {/* 價格標籤 */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
            ${formatPrice(property.price)}
          </div>
        </div>

        {/* 內容區域 */}
        <div className="p-5">
          {/* 標題 */}
          <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2 group-hover:text-orange-700 transition-colors">
            {property.title}
          </h3>

          {/* 地址 */}
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin size={16} className="mr-2 flex-shrink-0 text-orange-500" />
            <span className="text-sm truncate">{property.address}</span>
          </div>

          {/* 房型和坪數 */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center bg-orange-50 px-3 py-1.5 rounded-lg">
              <Home size={16} className="mr-2 text-orange-500" />
              <span className="font-medium">{property.room_type}</span>
            </div>
            <div className="flex items-center bg-red-50 px-3 py-1.5 rounded-lg">
              <Ruler size={16} className="mr-2 text-red-500" />
              <span className="font-medium">{property.area}坪</span>
            </div>
          </div>

          {/* 特色標籤 */}
          {property.features && property.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {property.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="text-orange-500 text-xs font-medium">+{property.features.length - 3}</span>
              )}
            </div>
          )}

          {/* 聯絡資訊 */}
          <div className="flex items-center justify-between text-sm pt-3 border-t border-orange-100">
            <div className="flex items-center text-gray-600">
              <Phone size={14} className="mr-2 text-orange-500" />
              <span className="font-medium">{property.contact_name}</span>
            </div>
            <div className="text-orange-600 font-bold">
              {property.floor}F/{property.total_floors}F
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
