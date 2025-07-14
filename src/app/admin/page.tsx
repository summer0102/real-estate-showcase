'use client';

import { useState, useEffect } from 'react';
import { Property, PropertyFormData } from '@/types/property';
import { propertyService } from '@/lib/supabase';
import { useAdminAuth } from '@/lib/auth';
import AdminLogin from '@/components/AdminLogin';
import PropertyForm from '@/components/PropertyForm';
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Home, 
  Eye,
  Loader2,
  AlertTriangle
} from 'lucide-react';

export default function AdminPanel() {
  const { isAuthenticated, isLoading: authLoading, login, logout } = useAdminAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadProperties();
    }
  }, [isAuthenticated]);

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

  const handleCreateProperty = async (formData: PropertyFormData & { images: string[] }) => {
    try {
      setIsLoading(true);
      setError(null);

      const newProperty = {
        ...formData,
        is_available: true,
      };

      await propertyService.createProperty(newProperty);
      setSuccess('物件新增成功！');
      setShowForm(false);
      await loadProperties();
    } catch (err) {
      console.error('新增物件失敗:', err);
      setError('新增物件失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProperty = async (formData: PropertyFormData & { images: string[] }) => {
    if (!editingProperty) return;

    try {
      setIsLoading(true);
      setError(null);

      await propertyService.updateProperty(editingProperty.id, formData);
      setSuccess('物件更新成功！');
      setEditingProperty(null);
      setShowForm(false);
      await loadProperties();
    } catch (err) {
      console.error('更新物件失敗:', err);
      setError('更新物件失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = async (id: string, title: string) => {
    if (!confirm(`確定要刪除物件「${title}」嗎？此操作無法復原。`)) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await propertyService.deleteProperty(id);
      setSuccess('物件刪除成功！');
      await loadProperties();
    } catch (err) {
      console.error('刪除物件失敗:', err);
      setError('刪除物件失敗，請稍後再試');
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

  // 清除訊息
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin" size={24} />
          <span>載入中...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <PropertyForm
            property={editingProperty || undefined}
            onSubmit={editingProperty ? handleUpdateProperty : handleCreateProperty}
            onCancel={() => {
              setShowForm(false);
              setEditingProperty(null);
            }}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 標題列 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Home className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">管理後台</h1>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut size={20} />
              <span>登出</span>
            </button>
          </div>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 操作列 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800">物件管理</h2>
            <span className="text-sm text-gray-600">
              共 {properties.length} 個物件
            </span>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>新增物件</span>
          </button>
        </div>

        {/* 訊息提示 */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="text-red-600 mr-2" size={20} />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* 物件列表 */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin mx-auto mb-4" size={48} />
            <p className="text-gray-600">載入中...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-medium text-gray-600 mb-2">尚無物件</h3>
            <p className="text-gray-500 mb-4">開始新增您的第一個物件</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              新增物件
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      物件資訊
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      價格/坪數
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      聯絡資訊
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      建立時間
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {getPropertyTypeText(property.property_type)} • {property.room_type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          ${formatPrice(property.price)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.area}坪
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {property.contact_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.contact_phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(property.created_at).toLocaleDateString('zh-TW')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <a
                            href={`/property/${property.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="查看"
                          >
                            <Eye size={18} />
                          </a>
                          <button
                            onClick={() => {
                              setEditingProperty(property);
                              setShowForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="編輯"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property.id, property.title)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="刪除"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
