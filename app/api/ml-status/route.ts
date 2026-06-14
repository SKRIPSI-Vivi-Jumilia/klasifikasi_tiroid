import { NextResponse } from 'next/server' // Mengimpor NextResponse untuk mengirim response JSON  

export async function GET() {
  try {
    //mengirim permintaan ke Flask API
    const response = await fetch('http://127.0.0.1:5000/health', { // endpoint 
      method: 'GET', // Menggunakan metode GET
      // timeout 3 detik agar UI tidak menunggu terlalu lama
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
