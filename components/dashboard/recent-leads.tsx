"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { mockLeads } from "@/lib/mock-data";

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

export function RecentLeads() {
  const recentLeads = mockLeads.slice(0, 5);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Recent Leads</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/leads" className="flex items-center gap-1">
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentLeads.map((lead) => (
            <Link
              key={lead.id}
              href={`/leads/${lead.id}`}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground truncate">{lead.name}</h4>
                  <Badge className={stateColors[lead.state]} variant="secondary">
                    {lead.state.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {lead.title} at {lead.company}
                </p>
              </div>
              <div className="text-xs text-muted-foreground ml-4">
                {new Date(lead.lastMessageAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
