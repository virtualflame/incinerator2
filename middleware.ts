import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For now, just allow all access to admin
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 