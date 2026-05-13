import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="no-print">
        <Sidebar />
      </div>
      <div className="flex flex-col">
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
