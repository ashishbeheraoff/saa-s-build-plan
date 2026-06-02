"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Link2,
  MessageSquare,
  Target,
  CalendarCheck,
  DollarSign,
} from "lucide-react";
import {
  mockKPIs,
  mockFunnelData,
  mockDailyActivity,
  mockCampaignPerformance,
  mockReplyRateTrend,
  mockDealOutcomes,
  mockHeatmapData,
  mockLeads,
} from "@/lib/mock-data";
import { useChartColors } from "@/hooks/use-chart-colors";

const kpiConfig = [
  { title: "Total Leads", value: mockKPIs.totalLeads, icon: Users, format: "number" },
  { title: "Connection Rate", value: mockKPIs.connectionRate, icon: Link2, format: "percent" },
  { title: "Reply Rate", value: mockKPIs.replyRate, icon: MessageSquare, format: "percent" },
  { title: "Conversion Rate", value: mockKPIs.conversionRate, icon: Target, format: "percent" },
  { title: "Meetings Booked", value: mockKPIs.meetingsBooked, icon: CalendarCheck, format: "number" },
  { title: "Revenue", value: mockKPIs.revenue, icon: DollarSign, format: "currency" },
];

function formatValue(value: number, format: string) {
  switch (format) {
    case "percent":
      return `${value}%`;
    case "currency":
      return `$${value.toLocaleString()}`;
    default:
      return value.toLocaleString();
  }
}

function ActivityHeatmap() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getColor = (value: number) => {
    if (value < 20) return "bg-muted/30";
    if (value < 40) return "bg-primary/20";
    if (value < 60) return "bg-primary/40";
    if (value < 80) return "bg-primary/60";
    return "bg-primary";
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <div className="w-10" />
        {hours.filter((_, i) => i % 3 === 0).map((hour) => (
          <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
            {hour}:00
          </div>
        ))}
      </div>
      {days.map((day, dayIndex) => (
        <div key={day} className="flex gap-1 items-center">
          <div className="w-10 text-xs text-muted-foreground">{day}</div>
          {hours.map((hour) => {
            const data = mockHeatmapData.find(
              (d) => d.day === dayIndex && d.hour === hour
            );
            return (
              <div
                key={hour}
                className={`flex-1 h-4 rounded-sm ${getColor(data?.value || 0)}`}
                title={`${day} ${hour}:00 - ${data?.value || 0} activities`}
              />
            );
          })}
        </div>
      ))}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-sm bg-muted/30" />
          <div className="w-4 h-4 rounded-sm bg-primary/20" />
          <div className="w-4 h-4 rounded-sm bg-primary/40" />
          <div className="w-4 h-4 rounded-sm bg-primary/60" />
          <div className="w-4 h-4 rounded-sm bg-primary" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const colors = useChartColors();

  const pieColors = [
    colors.success || "#10B981",
    colors.destructive || "#EF4444",
    colors.chart2 || "#06B6D4",
    colors.muted || "#A1A1AA",
  ];

  const topEngagedLeads = mockLeads
    .filter((l) => l.state === "qualified" || l.state === "meeting_booked" || l.state === "converted")
    .slice(0, 5);

  const activityData = mockDailyActivity.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm">
            Deep dive into your outreach performance
          </p>
        </div>
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="7d">7 days</TabsTrigger>
            <TabsTrigger value="30d">30 days</TabsTrigger>
            <TabsTrigger value="90d">90 days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Cards */}
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
              <div className="text-2xl font-bold font-mono">
                {formatValue(kpi.value, kpi.format)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Funnel Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Lead Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ count: { label: "Leads", color: "var(--chart-1)" } }}
              className="h-[280px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockFunnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border || "#27272A"} horizontal={false} />
                  <XAxis type="number" stroke={colors.mutedForeground || "#A1A1AA"} fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="stage"
                    stroke={colors.mutedForeground || "#A1A1AA"}
                    fontSize={12}
                    width={80}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {mockFunnelData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors.chart1 || "#7C3AED"}
                        fillOpacity={1 - index * 0.1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Activity Timeseries */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Activity Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                connects: { label: "Connects", color: "var(--chart-1)" },
                messages: { label: "Messages", color: "var(--chart-2)" },
                replies: { label: "Replies", color: "var(--chart-3)" },
                meetings: { label: "Meetings", color: "var(--chart-4)" },
              }}
              className="h-[280px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="connectsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.chart1 || "#7C3AED"} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={colors.chart1 || "#7C3AED"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border || "#27272A"} />
                  <XAxis dataKey="date" stroke={colors.mutedForeground || "#A1A1AA"} fontSize={12} />
                  <YAxis stroke={colors.mutedForeground || "#A1A1AA"} fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="connects"
                    stroke={colors.chart1 || "#7C3AED"}
                    fill="url(#connectsGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="messages"
                    stroke={colors.chart2 || "#06B6D4"}
                    fill="transparent"
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
      </div>

      {/* Campaign Performance Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Connected</TableHead>
                <TableHead className="text-right">Replied</TableHead>
                <TableHead className="text-right">Meetings</TableHead>
                <TableHead className="text-right">Conversion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaignPerformance.map((campaign) => (
                <TableRow key={campaign.name}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell className="text-right font-mono">{campaign.leads}</TableCell>
                  <TableCell className="text-right font-mono">{campaign.connected}</TableCell>
                  <TableCell className="text-right font-mono">{campaign.replied}</TableCell>
                  <TableCell className="text-right font-mono">{campaign.meetings}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="secondary"
                      className={
                        campaign.conversionRate >= 5
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {campaign.conversionRate}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Reply Rate Trend */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Reply Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                overall: { label: "Overall", color: "var(--chart-1)" },
                topCampaign: { label: "Top Campaign", color: "var(--chart-2)" },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockReplyRateTrend.map((d) => ({
                    ...d,
                    date: new Date(d.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    }),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border || "#27272A"} />
                  <XAxis dataKey="date" stroke={colors.mutedForeground || "#A1A1AA"} fontSize={12} />
                  <YAxis stroke={colors.mutedForeground || "#A1A1AA"} fontSize={12} unit="%" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="overall"
                    stroke={colors.chart1 || "#7C3AED"}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="topCampaign"
                    stroke={colors.chart2 || "#06B6D4"}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Deal Outcomes */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Deal Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <ChartContainer
                config={{
                  won: { label: "Won", color: "var(--chart-1)" },
                  lost: { label: "Lost", color: "var(--destructive)" },
                  inProgress: { label: "In Progress", color: "var(--chart-3)" },
                  noDecision: { label: "No Decision", color: "var(--muted)" },
                }}
                className="h-[200px] w-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockDealOutcomes}
                      dataKey="count"
                      nameKey="outcome"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                    >
                      {mockDealOutcomes.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index] || "#7C3AED"} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="space-y-3">
                {mockDealOutcomes.map((outcome, index) => (
                  <div key={outcome.outcome} className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: pieColors[index] }}
                    />
                    <span className="text-sm">{outcome.outcome}</span>
                    <span className="font-mono text-sm text-muted-foreground">
                      {outcome.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Engaged Leads */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Engaged Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topEngagedLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.company}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        {lead.state.replace("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Activity Heatmap */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Activity Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityHeatmap />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
