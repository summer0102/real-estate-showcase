'use client';

import { useState, useEffect } from 'react';

const ADMIN_SESSION_KEY = 'admin_authenticated';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24小時

export interface AdminSession {
  authenticated: boolean;
  timestamp: number;
}

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
      if (sessionData) {
        const session: AdminSession = JSON.parse(sessionData);
        const now = Date.now();
        
        // 檢查 session 是否過期
        if (now - session.timestamp < SESSION_DURATION && session.authenticated) {
          setIsAuthenticated(true);
        } else {
          // Session 過期，清除
          localStorage.removeItem(ADMIN_SESSION_KEY);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('檢查認證狀態失敗:', error);
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (password: string): Promise<boolean> => {
    try {
      // 呼叫 API 驗證密碼
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // 儲存認證狀態
        const session: AdminSession = {
          authenticated: true,
          timestamp: Date.now(),
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
        setIsAuthenticated(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('登入失敗:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
