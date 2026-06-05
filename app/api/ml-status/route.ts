import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('http://127.0.0.1:5000/health', {
      method: 'GET',
      // Short timeout so the UI doesn't hang
      signal: AbortSignal.timeout(3000),
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({ connected: true, ...data })
    }

    return NextResponse.json({ connected: false }, { status: 503 })
  } catch {
    return NextResponse.json({ connected: false }, { status: 503 })
  }
}
