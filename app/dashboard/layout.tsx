import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="no-print">
        <Sidebar />
        <MobileNav />
      </div>
      <div className="flex flex-col pb-24 lg:pb-0">
        <div className="no-print">
          <Header />
        </div>
        <main className="flex-1 lg:ml-72 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
