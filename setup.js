#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🏠 房仲物件展示系統 - 快速設定');
  console.log('=====================================\n');

  try {
    // 檢查是否已有 .env.local
    const envPath = path.join(__dirname, '.env.local');
    const envExamplePath = path.join(__dirname, '.env.local.example');
    
    if (fs.existsSync(envPath)) {
      const overwrite = await question('⚠️  .env.local 檔案已存在，是否要覆蓋？ (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('設定已取消。');
        rl.close();
        return;
      }
    }

    console.log('\n請輸入您的 Supabase 設定：');
    console.log('(可以在 Supabase 專案的 Settings > API 中找到)\n');

    const supabaseUrl = await question('Supabase Project URL: ');
    const supabaseAnonKey = await question('Supabase Anon Key: ');
    const supabaseServiceKey = await question('Supabase Service Role Key: ');
    
    console.log('\n請設定管理員密碼：');
    const adminPassword = await question('管理員密碼: ');

    // 驗證輸入
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey || !adminPassword) {
      console.log('❌ 所有欄位都是必填的！');
      rl.close();
      return;
    }

    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      console.log('❌ Supabase URL 格式不正確！應該類似：https://your-project.supabase.co');
      rl.close();
      return;
    }

    // 建立 .env.local 檔案
    const envContent = `# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# 管理員密碼 (用於後台管理)
ADMIN_PASSWORD=${adminPassword}
`;

    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ 設定完成！');
    console.log('\n接下來的步驟：');
    console.log('1. 確保您已在 Supabase 中執行了 database/schema.sql');
    console.log('2. 執行 npm run dev 啟動開發伺服器');
    console.log('3. 開啟 http://localhost:3000 測試應用程式');
    console.log('4. 前往 /admin 測試管理後台');
    console.log('\n📖 詳細部署指南請參考 DEPLOYMENT.md');

  } catch (error) {
    console.error('❌ 設定過程中發生錯誤：', error.message);
  }

  rl.close();
}

// 檢查是否在正確的目錄中
if (!fs.existsSync(path.join(__dirname, 'package.json'))) {
  console.error('❌ 請在專案根目錄中執行此腳本！');
  process.exit(1);
}

setup();
