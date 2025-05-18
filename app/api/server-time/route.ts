import { NextResponse } from "next/server"

export async function GET() {
  // 返回服务器当前时间
  return NextResponse.json({
    time: new Date().toISOString(),
  })
}
