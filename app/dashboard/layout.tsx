import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  const currentRole = profile?.role ?? 'user'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="no-print">
        <Sidebar role={currentRole} />
        <MobileNav role={currentRole} />
      </div>
      <div className="flex flex-col pb-24 lg:pb-0">
        <div className="no-print">
          <Header profile={profile} />
        </div>
        <main className="flex-1 lg:ml-72 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
