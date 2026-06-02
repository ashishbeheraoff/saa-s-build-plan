"use client";

import { use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { ArrowLeft, Play, Pause, ExternalLink } from "lucide-react";
import { mockCampaigns, mockLeads, mockFunnelData } from "@/lib/mock-data";
import { useChartColors } from "@/hooks/use-chart-colors";

const statusColors = {
  active: "bg-primary text-primary-foreground",
  paused: "bg-warning text-warning-foreground",
  completed: "bg-muted text-muted-foreground",
  draft: "bg-secondary text-secondary-foreground",
};

const stateColors: Record<string, string> = {
  new: "bg-secondary text-secondary-foreground",
  connected: "bg-chart-2 text-foreground",
  messaged: "bg-chart-3 text-foreground",
  replied: "bg-chart-4 text-foreground",
  qualified: "bg-primary text-primary-foreground",
  meeting_booked: "bg-primary text-primary-foreground",
  converted: "bg-primary text-primary-foreground",
  disqualified: "bg-destructive text-destructive-foreground",
};

const chartConfig = {
  count: {
    label: "Leads",
    color: "var(--chart-1)",
  },
};

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const colors = useChartColors();
  const campaign = mockCampaigns.find((c) => c.id === id);
  const campaignLeads = mockLeads.filter((l) => l.campaignId === id);

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground">Campaign not found</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/campaigns">Back to Campaigns</Link>
        </Button>
      </div>
    );
  }

  const progress = (campaign.completed / campaign.total) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/campaigns">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{campaign.name}</h1>
            <Badge className={statusColors[campaign.status]}>{campaign.status}</Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">{campaign.objective}</p>
        </div>
        <div className="flex items-center gap-2">
          {campaign.status === "active" ? (
            <Button variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button>
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Seeds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{campaign.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Qualified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-primary">
              {campaign.qualified}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Connected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{campaign.connected}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{Math.round(progress)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Lead Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockFunnelData} layout="vertical">
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
                      fillOpacity={1 - index * 0.12}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Campaign Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaignLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No leads in this campaign yet
                  </TableCell>
                </TableRow>
              ) : (
                campaignLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.title}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.company}</TableCell>
                    <TableCell>
                      <Badge className={stateColors[lead.state]} variant="secondary">
                        {lead.state.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {new Date(lead.lastMessageAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/leads/${lead.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
