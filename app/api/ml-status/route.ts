import { NextResponse } from 'next/server' // Mengimpor NextResponse untuk mengirim response JSON  

export async function GET() {
  const mlApiUrl = process.env.ML_API_URL || 'https://vivijumilia-model-xgboost.hf.space'
  try {
    //mengirim permintaan ke Flask API
    const response = await fetch(`${mlApiUrl}/health`, {
      method: 'GET',
      // Short timeout so the UI doesn't hang 
      signal: AbortSignal.timeout(3000),
    })

    // Jika API merespon dengan baik
    if (response.ok) {
      const data = await response.json() //mengambil data json dari API
      return NextResponse.json({ connected: true, ...data }) //mengembalikan status connected true
    }

    return NextResponse.json({ connected: false }, { status: 503 }) //jika api merespon tetapi statusnya error
  } catch {
    return NextResponse.json({ connected: false }, { status: 503 })
  }
}
