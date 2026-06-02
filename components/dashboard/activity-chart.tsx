"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { mockDailyActivity } from "@/lib/mock-data";
import { useChartColors } from "@/hooks/use-chart-colors";

const chartConfig = {
  connects: {
    label: "Connects",
    color: "var(--chart-1)",
  },
  messages: {
    label: "Messages",
    color: "var(--chart-2)",
  },
  replies: {
    label: "Replies",
    color: "var(--chart-3)",
  },
  meetings: {
    label: "Meetings",
    color: "var(--chart-4)",
  },
};

export function ActivityChart() {
  const colors = useChartColors();
  
  const formattedData = mockDailyActivity.map((item) => ({
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
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="connectsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.chart1 || "#7C3AED"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.chart1 || "#7C3AED"} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="messagesGradient" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="connects"
                stroke={colors.chart1 || "#7C3AED"}
                fill="url(#connectsGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="messages"
                stroke={colors.chart2 || "#06B6D4"}
                fill="url(#messagesGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="replies"
                stroke={colors.chart3 || "#8B5CF6"}
                fill="transparent"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="meetings"
                stroke={colors.chart4 || "#F59E0B"}
                fill="transparent"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
