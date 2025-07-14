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
    <div className="min-h-screen bg-white">
      {/* Instagram 風格返回按鈕 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            <span>返回列表</span>
          </button>
        </div>
      </div>

      {/* Instagram 風格內容 */}
      <div className="max-w-md mx-auto">
        {/* 圖片輪播 */}
        <div className="mb-6">
          <ImageCarousel images={property.images} title={property.title} />
        </div>

        {/* Instagram 風格物件資訊 */}
        <div className="bg-white border-b border-gray-100 pb-4">
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

          {/* Instagram 風格基本資訊 */}
          <div className="px-4 py-3 space-y-3 mb-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center">
                <Home className="mr-3 text-gray-500" size={18} />
                <span className="text-gray-600">房型</span>
              </div>
              <span className="font-medium text-gray-900">{property.room_type}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center">
                <Ruler className="mr-3 text-gray-500" size={18} />
                <span className="text-gray-600">坪數</span>
              </div>
              <span className="font-medium text-gray-900">{property.area}坪</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center">
                <Building className="mr-3 text-gray-500" size={18} />
                <span className="text-gray-600">樓層</span>
              </div>
              <span className="font-medium text-gray-900">{property.floor}F/{property.total_floors}F</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <Calendar className="mr-3 text-gray-500" size={18} />
                <span className="text-gray-600">屋齡</span>
              </div>
              <span className="font-medium text-gray-900">{property.age}年</span>
            </div>
          </div>

          {/* Instagram 風格詳細資訊 */}
          <div className="px-4 py-3 space-y-4 mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Compass className="mr-2 text-gray-500" size={18} />
                物件詳情
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">座向</span>
                  <span className="text-gray-900 font-medium">{property.direction}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">管理費</span>
                  <span className="text-gray-900 font-medium">${property.management_fee.toLocaleString()}/月</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">刊登日期</span>
                  <span className="text-gray-900 font-medium">{formatDate(property.created_at)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="mr-2 text-gray-500" size={18} />
                聯絡資訊
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">聯絡人</span>
                  <span className="text-gray-900 font-medium">{property.contact_name}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">電話</span>
                  <a
                    href={`tel:${property.contact_phone}`}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    {property.contact_phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Instagram 風格特色標籤 */}
          {property.features && property.features.length > 0 && (
            <div className="px-4 py-3 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">物件特色</h3>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Instagram 風格描述 */}
          {property.description && (
            <div className="px-4 py-3 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">物件描述</h3>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </div>
          )}
        </div>

        {/* Instagram 風格聯絡按鈕 */}
        <div className="bg-white border-t border-gray-100 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <a
              href={`tel:${property.contact_phone}`}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg text-center font-medium hover:shadow-lg transition-all flex items-center justify-center"
            >
              <Phone className="mr-2" size={18} />
              立即致電
            </a>
            <button
              onClick={() => {
                const message = `您好，我對您的物件「${property.title}」有興趣，請問是否方便詳談？`;
                const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
                window.open(lineUrl, '_blank');
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg text-center font-medium hover:shadow-lg transition-all flex items-center justify-center"
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
