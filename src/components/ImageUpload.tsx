'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { propertyService } from '@/lib/supabase';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // 檢查圖片數量限制
    if (images.length + files.length > maxImages) {
      setUploadError(`最多只能上傳 ${maxImages} 張圖片`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // 檢查檔案類型
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} 不是有效的圖片檔案`);
        }

        // 檢查檔案大小 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} 檔案大小超過 5MB`);
        }

        // 生成唯一檔名
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2);
        const extension = file.name.split('.').pop();
        const fileName = `property_${timestamp}_${randomString}.${extension}`;

        // 上傳圖片
        const imageUrl = await propertyService.uploadImage(file, fileName);
        return imageUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error('圖片上傳失敗:', error);
      setUploadError(error instanceof Error ? error.message : '圖片上傳失敗');
    } finally {
      setIsUploading(false);
      // 清空 input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];
    
    try {
      // 從 URL 中提取檔名
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await propertyService.deleteImage(fileName);
      }
    } catch (error) {
      console.error('刪除圖片失敗:', error);
      // 即使刪除失敗，仍然從列表中移除
    }

    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // 模擬 file input change 事件
      const event = {
        target: { files }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(event);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          物件照片 ({images.length}/{maxImages})
        </label>
        {uploadError && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle size={16} className="mr-1" />
            {uploadError}
          </div>
        )}
      </div>

      {/* 上傳區域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          disabled 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
            : 'border-gray-300 hover:border-gray-400 cursor-pointer'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
            <p className="text-gray-600">上傳中...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="text-gray-400 mb-2" size={32} />
            <p className="text-gray-600 mb-1">
              點擊或拖拽圖片到此處上傳
            </p>
            <p className="text-sm text-gray-500">
              支援 JPG、PNG、GIF 格式，單檔最大 5MB
            </p>
          </div>
        )}
      </div>

      {/* 圖片預覽 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`圖片 ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('圖片載入失敗:', imageUrl);
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMTJMMTEgMTRMMTUgMTBNMjEgMTJDMjEgMTYuOTcwNiAxNi45NzA2IDIxIDEyIDIxQzcuMDI5NDQgMjEgMyAxNi45NzA2IDMgMTJDMyA3LjAyOTQ0IDcuMDI5NDQgMyAxMiAzQzE2Ljk3MDYgMyAyMSA3LjAyOTQ0IDIxIDEyWiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                  }}
                />
              </div>
              
              {/* 刪除按鈕 */}
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                disabled={disabled}
              >
                <X size={16} />
              </button>

              {/* 圖片順序 */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 提示文字 */}
      {images.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          建議上傳多張高品質照片以提升物件吸引力
        </p>
      )}
    </div>
  );
}
