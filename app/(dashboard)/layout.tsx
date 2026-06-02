import { AppSidebar } from "@/components/app-sidebar";
import { NotificationCenter } from "@/components/notification-center";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header with Notification Center */}
        <header className="flex items-center justify-end h-14 px-6 border-b border-border shrink-0">
          <NotificationCenter />
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
