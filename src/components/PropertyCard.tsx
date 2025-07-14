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
      <div className="ig-card overflow-hidden">
        {/* Instagram 風格用戶資訊 */}
        <div className="flex items-center p-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center mr-3">
            <Home className="text-white" size={16} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900">{property.contact_name}</p>
            <p className="text-xs text-gray-500">{getPropertyTypeText(property.property_type)}</p>
          </div>
        </div>

        {/* 圖片區域 */}
        <div className="relative w-full h-80 bg-gray-100">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
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
          
          {/* 價格標籤 */}
          <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm font-bold">
            ${formatPrice(property.price)}
          </div>
        </div>

        {/* Instagram 風格互動區域 */}
        <div className="px-3 py-2">
          {/* 按讚和分享按鈕 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <button className="hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="hover:text-gray-600">
                <Phone size={20} />
              </button>
            </div>
            <div className="text-sm font-bold text-gray-900">
              ${formatPrice(property.price)}
            </div>
          </div>

          {/* 標題和描述 */}
          <div className="mb-2">
            <p className="text-sm">
              <span className="font-semibold text-gray-900">{property.contact_name}</span>
              <span className="text-gray-900 ml-1">{property.title}</span>
            </p>
          </div>

          {/* 地址和詳細資訊 */}
          <div className="text-sm text-gray-500 mb-2">
            <div className="flex items-center mb-1">
              <MapPin size={12} className="mr-1" />
              <span>{property.address}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{property.room_type}</span>
              <span>{property.area}坪</span>
              <span>{property.floor}F/{property.total_floors}F</span>
            </div>
          </div>

          {/* 特色標籤 */}
          {property.features && property.features.length > 0 && (
            <div className="text-sm text-gray-500 mb-2">
              #{property.features.slice(0, 3).join(' #')}
              {property.features.length > 3 && ` +${property.features.length - 3}more`}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
