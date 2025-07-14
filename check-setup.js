#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 讀取 .env.local 檔案
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};

  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });

  return env;
}

async function checkSetup() {
  console.log('🔍 檢查 Supabase 設定...\n');

  // 載入環境變數
  const env = loadEnvFile();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ 環境變數未設定');
    console.log('請執行 npm run setup 設定環境變數');
    return;
  }

  console.log('✅ 環境變數已設定');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);

  // 建立客戶端
  const supabase = createClient(supabaseUrl, supabaseKey);
  const adminSupabase = createClient(supabaseUrl, serviceKey);

  try {
    // 檢查資料表
    console.log('\n🔍 檢查 properties 資料表...');
    const { data, error } = await supabase
      .from('properties')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.log('❌ properties 資料表不存在');
      console.log('請在 Supabase SQL Editor 中執行 database/schema.sql');
      console.log('錯誤:', error.message);
    } else {
      console.log('✅ properties 資料表存在');
      console.log(`📊 目前有 ${data?.length || 0} 筆資料`);
    }

    // 檢查儲存桶
    console.log('\n🔍 檢查 property-images 儲存桶...');
    const { data: buckets, error: bucketError } = await adminSupabase.storage.listBuckets();

    if (bucketError) {
      console.log('❌ 無法檢查儲存桶:', bucketError.message);
    } else {
      const propertyBucket = buckets.find(bucket => bucket.name === 'property-images');
      if (propertyBucket) {
        console.log('✅ property-images 儲存桶存在');
        console.log(`🔓 Public: ${propertyBucket.public ? '是' : '否'}`);
      } else {
        console.log('❌ property-images 儲存桶不存在');
        console.log('請在 Supabase Storage 中建立 property-images 儲存桶');
      }
    }

    // 檢查 RLS 政策
    console.log('\n🔍 檢查 Row Level Security...');
    const { data: policies, error: policyError } = await adminSupabase
      .rpc('get_policies', { table_name: 'properties' })
      .catch(() => ({ data: null, error: { message: '無法檢查政策' } }));

    if (policyError) {
      console.log('⚠️  無法檢查 RLS 政策');
    } else {
      console.log('✅ RLS 政策檢查完成');
    }

  } catch (error) {
    console.log('❌ 連線失敗:', error.message);
    console.log('請檢查 Supabase URL 和 API Key 是否正確');
  }

  console.log('\n📋 設定檢查完成');
  console.log('\n如果有問題，請按照以下步驟修復：');
  console.log('1. 在 Supabase SQL Editor 執行 database/schema.sql');
  console.log('2. 在 Supabase Storage 建立 property-images 儲存桶');
  console.log('3. 重新啟動開發伺服器: npm run dev');
}

checkSetup().catch(console.error);
