'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Menu, X } from 'lucide-react';

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: '首頁', href: '/', icon: Home },
    { name: '管理後台', href: '/admin', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* 手機版導航按鈕 */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-lg rounded-full p-3 text-gray-600 hover:text-gray-800 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 手機版導航選單 */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 導航選單 */}
          <div className="absolute top-0 right-0 h-full w-64 bg-white shadow-xl">
            <div className="p-6 pt-20">
              <nav className="space-y-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* 桌面版導航 (隱藏在手機版) */}
      <div className="hidden md:block fixed top-4 right-4 z-50">
        <div className="bg-white shadow-lg rounded-lg p-2">
          <nav className="flex space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={item.name}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
