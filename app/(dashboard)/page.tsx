import { KPICards } from "@/components/dashboard/kpi-cards";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { RecentCampaigns } from "@/components/dashboard/recent-campaigns";
import { RecentLeads } from "@/components/dashboard/recent-leads";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-muted-foreground text-sm">
          Monitor your outreach performance at a glance
        </p>
      </div>

      <KPICards />

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityChart />
        <RecentCampaigns />
      </div>

      <RecentLeads />
    </div>
  );
}
