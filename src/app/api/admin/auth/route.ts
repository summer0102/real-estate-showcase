import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // 從環境變數取得管理員密碼
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      return NextResponse.json(
        { error: '管理員密碼未設定' },
        { status: 500 }
      );
    }
    
    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: '密碼錯誤' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('認證 API 錯誤:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}
