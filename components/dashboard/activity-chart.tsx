"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useChartColors } from "@/hooks/use-chart-colors";

interface DailyActivity {
  id: string;
  user_id: string;
  date: string;
  emails_sent: number;
  replies_received: number;
  meetings_booked: number;
  new_leads: number;
}

const chartConfig = {
  emails_sent: {
    label: "Emails Sent",
    color: "var(--chart-1)",
  },
  replies_received: {
    label: "Replies",
    color: "var(--chart-2)",
  },
  meetings_booked: {
    label: "Meetings",
    color: "var(--chart-3)",
  },
  new_leads: {
    label: "New Leads",
    color: "var(--chart-4)",
  },
};

async function fetchActivity(): Promise<DailyActivity[]> {
  const res = await fetch("/api/dashboard/activity");
  if (!res.ok) throw new Error("Failed to fetch activity");
  return res.json();
}

export function ActivityChart() {
  const colors = useChartColors();
  const { data, isLoading } = useSWR<DailyActivity[]>("dashboard-activity", fetchActivity, {
    refreshInterval: 60000,
  });
  
  const formattedData = (data || []).map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Activity Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        ) : formattedData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No activity data yet. Start sending emails to see your stats here.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedData}>
                <defs>
                  <linearGradient id="emailsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.chart1 || "#7C3AED"} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.chart1 || "#7C3AED"} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="repliesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.chart2 || "#06B6D4"} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.chart2 || "#06B6D4"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border || "#27272A"} />
                <XAxis 
                  dataKey="date" 
                  stroke={colors.mutedForeground || "#A1A1AA"} 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke={colors.mutedForeground || "#A1A1AA"} 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="emails_sent"
                  stroke={colors.chart1 || "#7C3AED"}
                  fill="url(#emailsGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="replies_received"
                  stroke={colors.chart2 || "#06B6D4"}
                  fill="url(#repliesGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="meetings_booked"
                  stroke={colors.chart3 || "#8B5CF6"}
                  fill="transparent"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="new_leads"
                  stroke={colors.chart4 || "#F59E0B"}
                  fill="transparent"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
