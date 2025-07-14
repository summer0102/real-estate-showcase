# 部署指南

## 步驟 1: 設定 Supabase

### 1.1 建立 Supabase 專案
1. 前往 [Supabase](https://supabase.com)
2. 點擊 "Start your project"
3. 登入或註冊帳號
4. 點擊 "New project"
5. 選擇組織，輸入專案名稱（如：real-estate-showcase）
6. 設定資料庫密碼
7. 選擇地區（建議選擇 Asia Pacific (Singapore) 以獲得更好的速度）
8. 點擊 "Create new project"

### 1.2 取得 API 金鑰
1. 在專案儀表板中，點擊左側選單的 "Settings"
2. 點擊 "API"
3. 複製以下資訊：
   - Project URL
   - anon public key
   - service_role key

### 1.3 建立資料表
1. 在專案儀表板中，點擊左側選單的 "SQL Editor"
2. 點擊 "New query"
3. 複製 `database/schema.sql` 檔案的內容
4. 貼上到 SQL 編輯器中
5. 點擊 "Run" 執行

### 1.4 設定儲存桶
1. 點擊左側選單的 "Storage"
2. 確認 `property-images` 儲存桶已建立
3. 如果沒有，點擊 "Create bucket"
4. 名稱輸入 `property-images`
5. 設定為 Public bucket
6. 點擊 "Create bucket"

## 步驟 2: 更新環境變數

編輯 `.env.local` 檔案：

```env
# 替換為您的 Supabase 設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 設定管理員密碼
ADMIN_PASSWORD=your-secure-password
```

## 步驟 3: 本地測試

```bash
# 重新啟動開發伺服器
npm run dev

# 測試功能
# 1. 開啟 http://localhost:3000
# 2. 前往 /admin 測試管理後台
# 3. 新增一個測試物件
# 4. 確認前台可以正常顯示
```

## 步驟 4: 部署到 Vercel

### 4.1 推送到 GitHub
```bash
# 初始化 Git（如果還沒有）
git init

# 新增所有檔案
git add .

# 提交
git commit -m "Initial commit: Real Estate Showcase System"

# 連接到 GitHub repository
git remote add origin https://github.com/your-username/real-estate-showcase.git

# 推送
git push -u origin main
```

### 4.2 在 Vercel 部署
1. 前往 [Vercel](https://vercel.com)
2. 登入並點擊 "New Project"
3. 匯入您的 GitHub repository
4. 在 "Environment Variables" 區域新增：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_PASSWORD=your-secure-password
   ```
5. 點擊 "Deploy"

### 4.3 設定自訂網域（可選）
1. 在 Vercel 專案設定中點擊 "Domains"
2. 新增您的網域
3. 按照指示設定 DNS

## 步驟 5: 測試部署

1. 開啟您的 Vercel 網址
2. 測試前台功能：
   - 物件列表載入
   - 搜尋和篩選
   - 物件詳情頁面
3. 測試後台功能：
   - 前往 `/admin`
   - 使用管理員密碼登入
   - 新增、編輯、刪除物件
   - 上傳圖片

## 常見問題

### Q: Supabase 連線失敗
**A:** 檢查環境變數是否正確設定，確認 Project URL 和 API 金鑰無誤。

### Q: 圖片上傳失敗
**A:** 確認 Supabase Storage 中的 `property-images` 儲存桶已建立且設定為 public。

### Q: 管理後台無法登入
**A:** 檢查 `ADMIN_PASSWORD` 環境變數是否正確設定。

### Q: 部署後環境變數不生效
**A:** 在 Vercel 中重新部署專案，確保環境變數已正確設定。

## 安全建議

1. **管理員密碼**：使用強密碼，定期更換
2. **Supabase 金鑰**：不要將 service_role key 暴露在前端
3. **RLS 政策**：確認 Supabase 的 Row Level Security 政策已正確設定
4. **HTTPS**：確保網站使用 HTTPS（Vercel 預設提供）

## 維護

### 定期備份
- 定期備份 Supabase 資料庫
- 備份上傳的圖片

### 監控
- 監控 Vercel 部署狀態
- 監控 Supabase 使用量

### 更新
- 定期更新依賴套件
- 關注 Next.js 和 Supabase 的更新
