"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Link2, 
  MessageSquare, 
  Target,
  Cpu,
  Send
} from "lucide-react";

interface KPIData {
  totalLeads: number;
  totalCampaigns: number;
  avgReplyRate: number;
  totalMeetings: number;
  weeklyEmailsSent: number;
  weeklyReplies: number;
  conversionRate: number;
}

async function fetchKPIs(): Promise<KPIData> {
  const res = await fetch("/api/dashboard/kpis");
  if (!res.ok) throw new Error("Failed to fetch KPIs");
  return res.json();
}

export function KPICards() {
  const { data, isLoading, error } = useSWR<KPIData>("dashboard-kpis", fetchKPIs, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const kpiConfig = [
    {
      title: "Total Leads",
      value: data?.totalLeads?.toLocaleString() ?? "0",
      icon: Users,
      description: "All time leads generated"
    },
    {
      title: "Active Campaigns",
      value: data?.totalCampaigns?.toString() ?? "0",
      icon: Cpu,
      description: "Campaigns running"
    },
    {
      title: "Reply Rate",
      value: `${data?.avgReplyRate ?? 0}%`,
      icon: MessageSquare,
      description: "Average across campaigns"
    },
    {
      title: "Conversion Rate",
      value: `${data?.conversionRate ?? 0}%`,
      icon: Target,
      description: "Leads to meetings"
    },
    {
      title: "Meetings Booked",
      value: data?.totalMeetings?.toString() ?? "0",
      icon: Link2,
      description: "Total meetings scheduled"
    },
    {
      title: "Emails This Week",
      value: data?.weeklyEmailsSent?.toString() ?? "0",
      icon: Send,
      description: "Sent in last 7 days"
    }
  ];

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
        Failed to load dashboard data. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpiConfig.map((kpi) => (
        <Card key={kpi.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-3 w-24" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold font-mono text-foreground">
                  {kpi.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {kpi.description}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
