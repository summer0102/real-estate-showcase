'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { PropertyFilter as FilterType } from '@/types/property';

interface PropertyFilterProps {
  onFilterChange: (filters: FilterType) => void;
  isLoading?: boolean;
}

export default function PropertyFilter({ onFilterChange, isLoading }: PropertyFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterType>({});

  const propertyTypes = [
    { value: '', label: '全部類型' },
    { value: 'apartment', label: '公寓' },
    { value: 'house', label: '透天' },
    { value: 'studio', label: '套房' },
    { value: 'office', label: '辦公室' }
  ];

  const roomTypes = [
    { value: '', label: '全部房型' },
    { value: '套房', label: '套房' },
    { value: '1房1廳1衛', label: '1房1廳1衛' },
    { value: '2房1廳1衛', label: '2房1廳1衛' },
    { value: '2房2廳1衛', label: '2房2廳1衛' },
    { value: '3房2廳2衛', label: '3房2廳2衛' },
    { value: '4房2廳2衛', label: '4房2廳2衛' }
  ];

  const handleFilterChange = (key: keyof FilterType, value: string | number) => {
    const newFilters = {
      ...filters,
      [key]: value === '' ? undefined : value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className="relative">
      {/* 篩選按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
          hasActiveFilters 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
        disabled={isLoading}
      >
        <Filter size={16} />
        <span>篩選</span>
        {hasActiveFilters && (
          <span className="bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-medium">
            {Object.values(filters).filter(v => v !== undefined && v !== '').length}
          </span>
        )}
      </button>

      {/* 篩選面板 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">篩選條件</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* 物件類型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                物件類型
              </label>
              <select
                value={filters.property_type || ''}
                onChange={(e) => handleFilterChange('property_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 房型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                房型
              </label>
              <select
                value={filters.room_type || ''}
                onChange={(e) => handleFilterChange('room_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roomTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 價格範圍 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                價格範圍 (元)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="最低價格"
                  value={filters.min_price || ''}
                  onChange={(e) => handleFilterChange('min_price', e.target.value ? Number(e.target.value) : '')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="最高價格"
                  value={filters.max_price || ''}
                  onChange={(e) => handleFilterChange('max_price', e.target.value ? Number(e.target.value) : '')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 坪數範圍 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                坪數範圍
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="最小坪數"
                  value={filters.min_area || ''}
                  onChange={(e) => handleFilterChange('min_area', e.target.value ? Number(e.target.value) : '')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="最大坪數"
                  value={filters.max_area || ''}
                  onChange={(e) => handleFilterChange('max_area', e.target.value ? Number(e.target.value) : '')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 清除篩選 */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                清除所有篩選
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
