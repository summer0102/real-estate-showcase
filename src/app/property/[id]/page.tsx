'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Property } from '@/types/property';
import { propertyService } from '@/lib/supabase';
import ImageCarousel from '@/components/ImageCarousel';
import {
  ArrowLeft,
  MapPin,
  Home,
  Ruler,
  Phone,
  User,
  Calendar,
  Building,
  Compass,
  Loader2
} from 'lucide-react';

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadProperty(params.id as string);
    }
  }, [params.id]);

  const loadProperty = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await propertyService.getPropertyById(id);
      if (data) {
        setProperty(data);
      } else {
        setError('找不到此物件');
      }
    } catch (err) {
      console.error('載入物件失敗:', err);
      setError('載入物件失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin" size={24} />
          <span>載入中...</span>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error || '找不到此物件'}
          </h2>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            返回上一頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen warm-bg">
      {/* 返回按鈕 */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            <span>返回列表</span>
          </button>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 圖片輪播 */}
        <div className="mb-6">
          <ImageCarousel images={property.images} title={property.title} />
        </div>

        {/* 物件資訊 */}
        <div className="warm-card p-6 mb-6">
          {/* 標題和價格 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-3 md:mb-0">
              {property.title}
            </h1>
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                ${formatPrice(property.price)}
              </span>
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                {getPropertyTypeText(property.property_type)}
              </span>
            </div>
          </div>

          {/* 地址 */}
          <div className="flex items-center text-gray-700 mb-6">
            <MapPin size={20} className="mr-3 flex-shrink-0 text-orange-500" />
            <span className="text-lg font-medium">{property.address}</span>
          </div>

          {/* 基本資訊網格 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl text-center border border-orange-100">
              <Home className="mx-auto mb-2 text-orange-600" size={24} />
              <div className="text-sm text-gray-700 font-medium">房型</div>
              <div className="font-bold text-gray-800">{property.room_type}</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl text-center border border-red-100">
              <Ruler className="mx-auto mb-2 text-red-600" size={24} />
              <div className="text-sm text-gray-700 font-medium">坪數</div>
              <div className="font-bold text-gray-800">{property.area}坪</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-xl text-center border border-orange-100">
              <Building className="mx-auto mb-2 text-orange-600" size={24} />
              <div className="text-sm text-gray-700 font-medium">樓層</div>
              <div className="font-bold text-gray-800">{property.floor}F/{property.total_floors}F</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl text-center border border-red-100">
              <Calendar className="mx-auto mb-2 text-red-600" size={24} />
              <div className="text-sm text-gray-700 font-medium">屋齡</div>
              <div className="font-bold text-gray-800">{property.age}年</div>
            </div>
          </div>

          {/* 詳細資訊 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <Compass className="mr-2 text-orange-600" size={20} />
                物件詳情
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">座向:</span>
                  <span className="text-gray-800 font-medium">{property.direction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">管理費:</span>
                  <span className="text-gray-800 font-medium">${property.management_fee.toLocaleString()}/月</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">刊登日期:</span>
                  <span className="text-gray-800 font-medium">{formatDate(property.created_at)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <User className="mr-2 text-orange-600" size={20} />
                聯絡資訊
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">聯絡人:</span>
                  <span className="text-gray-800 font-medium">{property.contact_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">電話:</span>
                  <a
                    href={`tel:${property.contact_phone}`}
                    className="text-orange-600 hover:text-red-600 font-medium transition-colors"
                  >
                    {property.contact_phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 特色標籤 */}
          {property.features && property.features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-4">物件特色</h3>
              <div className="flex flex-wrap gap-3">
                {property.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium border border-orange-200"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 描述 */}
          {property.description && (
            <div>
              <h3 className="font-bold text-gray-800 mb-4">物件描述</h3>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
                {property.description}
              </p>
            </div>
          )}
        </div>

        {/* 聯絡按鈕 */}
        <div className="warm-card p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <a
              href={`tel:${property.contact_phone}`}
              className="flex-1 warm-button text-white py-4 px-6 text-center font-bold hover:shadow-lg transition-all flex items-center justify-center"
            >
              <Phone className="mr-2" size={20} />
              立即致電
            </a>
            <button
              onClick={() => {
                const message = `您好，我對您的物件「${property.title}」有興趣，請問是否方便詳談？`;
                const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
                window.open(lineUrl, '_blank');
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl text-center font-bold hover:shadow-lg transition-all flex items-center justify-center"
            >
              <span className="mr-2">💬</span>
              LINE 詢問
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
