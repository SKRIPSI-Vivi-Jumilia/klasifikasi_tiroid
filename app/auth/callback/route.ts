import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// =====================================================
// CALLBACK AUTHENTICATION SUPABASE
// =====================================================
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url) // Mengambil URL yang sedang diakses
  const code = searchParams.get('code') // Mengambil parameter "code" dari URL
  // Mengambil tujuan redirect setelah login
  const next = searchParams.get('next') ?? '/dashboard'// Jika tidak ada maka diarahkan ke dashboard

  // =====================================================
  // JIKA ADA KODE AUTENTIKASI
  // =====================================================
  if (code) {
    const supabase = await createClient() // Membuat koneksi ke Supabase
    const { error } = await supabase.auth.exchangeCodeForSession(code) // Menukar kode verifikasi dengan sesi

    if (!error) { // Jika tidak ada error (berhasil login)
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) { // Jika mode development (lokal)
        return NextResponse.redirect(`${origin}${next}`) //redirect ke dashboard
      } else if (forwardedHost) { // JIKA DI HOSTING (VERCEL)
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else { //fallback redirect
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // jika login gagal, redirect ke halaman error
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
