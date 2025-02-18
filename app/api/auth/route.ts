import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    // Add console logs for debugging
    console.log('Received password:', password)
    console.log('Env password:', process.env.ADMIN_PASSWORD)
    
    const isValid = password === process.env.ADMIN_PASSWORD
    console.log('Is valid:', isValid)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
} 