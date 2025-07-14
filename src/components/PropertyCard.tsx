'use client';

import { Property } from '@/types/property';
import { MapPin, Home, Ruler, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* 圖片區域 */}
        <div className="relative h-48 bg-gray-200">
          {property.images && property.images.length > 0 ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Home size={48} />
            </div>
          )}
          
          {/* 物件類型標籤 */}
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
            {getPropertyTypeText(property.property_type)}
          </div>
          
          {/* 價格標籤 */}
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
            ${formatPrice(property.price)}
          </div>
        </div>

        {/* 內容區域 */}
        <div className="p-4">
          {/* 標題 */}
          <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
            {property.title}
          </h3>

          {/* 地址 */}
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin size={16} className="mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{property.address}</span>
          </div>

          {/* 房型和坪數 */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Home size={16} className="mr-1" />
              <span>{property.room_type}</span>
            </div>
            <div className="flex items-center">
              <Ruler size={16} className="mr-1" />
              <span>{property.area}坪</span>
            </div>
          </div>

          {/* 特色標籤 */}
          {property.features && property.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {property.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="text-gray-500 text-xs">+{property.features.length - 3}</span>
              )}
            </div>
          )}

          {/* 聯絡資訊 */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Phone size={14} className="mr-1" />
              <span>{property.contact_name}</span>
            </div>
            <div className="text-gray-500">
              {property.floor}F/{property.total_floors}F
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
