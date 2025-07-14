# 🏠 房仲物件展示系統 - 快速開始指南

歡迎使用房仲物件展示系統！這是一個專為手機瀏覽設計的現代化房地產展示平台。

## 🚀 5分鐘快速啟動

### 步驟 1: 安裝依賴
```bash
npm install
```

### 步驟 2: 自動設定
```bash
npm run setup
```
這個腳本會引導您設定 Supabase 連線和管理員密碼。

### 步驟 3: 設定 Supabase 資料庫
1. 前往您的 Supabase 專案
2. 開啟 SQL Editor
3. 執行 `database/schema.sql` 建立資料表
4. （可選）執行 `database/sample-data.sql` 插入示例資料

### 步驟 4: 啟動應用程式
```bash
npm run dev
```

🎉 **完成！** 開啟 http://localhost:3000 開始使用

## 📱 功能測試

### 前台功能測試
1. **首頁** - http://localhost:3000
   - 查看物件列表
   - 測試搜尋功能
   - 使用篩選器

2. **物件詳情** - 點擊任一物件卡片
   - 查看完整資訊
   - 測試照片輪播
   - 測試聯絡功能

### 後台管理測試
1. **管理後台** - http://localhost:3000/admin
   - 使用您設定的密碼登入
   - 新增測試物件
   - 上傳圖片
   - 編輯和刪除物件

## 🔧 常見問題

### Q: 無法連接 Supabase
**解決方案:**
1. 檢查 `.env.local` 中的 URL 和金鑰是否正確
2. 確認 Supabase 專案狀態正常
3. 重新啟動開發伺服器

### Q: 圖片上傳失敗
**解決方案:**
1. 確認 Supabase Storage 中有 `property-images` 儲存桶
2. 檢查儲存桶權限設定
3. 確認 Service Role Key 設定正確

### Q: 管理後台無法登入
**解決方案:**
1. 檢查 `ADMIN_PASSWORD` 環境變數
2. 重新執行 `npm run setup` 重設密碼

## 📚 下一步

### 自訂設定
- 修改 `src/types/property.ts` 調整物件欄位
- 編輯 `src/components/PropertyCard.tsx` 自訂卡片樣式
- 調整 `src/app/globals.css` 修改主題色彩

### 部署上線
1. 推送程式碼到 GitHub
2. 在 Vercel 建立新專案
3. 設定環境變數
4. 部署完成

詳細部署指南：[DEPLOYMENT.md](./DEPLOYMENT.md)

## 🆘 需要幫助？

- 📖 查看 [README.md](./README.md) 了解完整功能
- 🚀 參考 [DEPLOYMENT.md](./DEPLOYMENT.md) 進行部署
- 🐛 遇到問題請檢查 console 錯誤訊息

---

**祝您使用愉快！** 🎉
