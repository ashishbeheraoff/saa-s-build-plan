"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Link2, 
  MessageSquare, 
  Target,
  Cpu,
  Send
} from "lucide-react";
import { mockKPIs } from "@/lib/mock-data";

const kpiConfig = [
  {
    title: "Total Leads",
    value: mockKPIs.totalLeads.toLocaleString(),
    icon: Users,
    description: "All time leads generated"
  },
  {
    title: "Connection Rate",
    value: `${mockKPIs.connectionRate}%`,
    icon: Link2,
    description: "Requests accepted"
  },
  {
    title: "Reply Rate",
    value: `${mockKPIs.replyRate}%`,
    icon: MessageSquare,
    description: "Messages replied"
  },
  {
    title: "Conversion Rate",
    value: `${mockKPIs.conversionRate}%`,
    icon: Target,
    description: "Leads to meetings"
  },
  {
    title: "Active Workers",
    value: mockKPIs.activeWorkers.toString(),
    icon: Cpu,
    description: "Running automations"
  },
  {
    title: "Connects Today",
    value: mockKPIs.connectsToday.toString(),
    icon: Send,
    description: "Sent today"
  }
];

export function KPICards() {
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
            <div className="text-2xl font-bold font-mono text-foreground">
              {kpi.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpi.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
