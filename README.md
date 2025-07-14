# 房仲物件展示系統

一個專為手機瀏覽設計的房仲物件展示系統，支援物件上架、瀏覽和管理功能。

## 功能特色

### 🏠 前台功能
- **響應式設計** - 專為手機瀏覽優化
- **物件列表** - 卡片式佈局展示所有物件
- **搜尋功能** - 支援標題、地址、描述搜尋
- **篩選功能** - 依物件類型、價格、坪數、房型篩選
- **物件詳情** - 完整物件資訊和照片輪播
- **聯絡功能** - 一鍵撥號和 WhatsApp 詢問

### 🔧 後台管理
- **密碼保護** - 簡單的管理員認證
- **物件管理** - 新增、編輯、刪除物件
- **圖片上傳** - 支援多張圖片上傳和管理
- **即時預覽** - 直接查看物件在前台的顯示效果

## 技術架構

- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **後端**: Next.js API Routes
- **資料庫**: Supabase (PostgreSQL)
- **檔案儲存**: Supabase Storage
- **部署**: Vercel (推薦)

## 快速開始

### 方法一：自動設定（推薦）

```bash
# 1. 安裝依賴
npm install

# 2. 執行自動設定腳本
npm run setup

# 3. 啟動開發伺服器
npm run dev
```

### 方法二：手動設定

#### 1. 環境設定

```bash
# 安裝依賴
npm install

# 複製環境變數範例檔案
cp .env.local.example .env.local
```

#### 2. Supabase 設定

1. 前往 [Supabase](https://supabase.com) 建立新專案
2. 在專案設定中找到 API 設定
3. 複製 Project URL 和 anon public key
4. 編輯 `.env.local` 檔案，填入您的設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD=your_admin_password
```

#### 3. 建立資料表

在 Supabase SQL Editor 中執行：
1. `database/schema.sql` - 建立資料表和權限
2. `database/sample-data.sql` - 插入示例資料（可選）

#### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看應用程式。

## 使用說明

### 前台使用
1. 開啟首頁瀏覽所有物件
2. 使用搜尋欄或篩選功能找到感興趣的物件
3. 點擊物件卡片查看詳細資訊

### 後台管理
1. 前往 `/admin` 進入管理後台
2. 輸入管理員密碼登入 (預設: admin123)
3. 新增、編輯或刪除物件

## 部署

### 快速部署到 Vercel

1. 推送程式碼到 GitHub
2. 在 [Vercel](https://vercel.com) 匯入專案
3. 設定環境變數（與 .env.local 相同）
4. 部署完成

詳細部署指南請參考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 可用腳本

```bash
npm run dev          # 啟動開發伺服器
npm run build        # 建置生產版本
npm run start        # 啟動生產伺服器
npm run lint         # 執行 ESLint
npm run type-check   # 執行 TypeScript 類型檢查
npm run build-check  # 完整建置檢查（類型+Lint+建置）
npm run setup        # 自動設定環境變數
```

## 專案結構

```
real-estate-showcase/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # 管理後台
│   │   ├── api/            # API 路由
│   │   ├── property/       # 物件詳情頁面
│   │   └── page.tsx        # 首頁
│   ├── components/         # React 組件
│   ├── lib/               # 工具函數
│   └── types/             # TypeScript 類型
├── database/              # 資料庫相關檔案
│   ├── schema.sql         # 資料表結構
│   └── sample-data.sql    # 示例資料
├── .github/workflows/     # GitHub Actions
└── docs/                  # 文件
```
