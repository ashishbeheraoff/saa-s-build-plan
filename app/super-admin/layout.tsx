import { ThemeProvider } from "next-themes"

export const metadata = {
  title: "Super Admin | LeadRaider",
  description: "Manage users, analytics, and promo codes",
}

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </ThemeProvider>
  )
}
