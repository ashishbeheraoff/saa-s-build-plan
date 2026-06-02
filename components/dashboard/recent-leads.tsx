"use client";

import useSWR from "swr";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import type { Lead } from "@/lib/supabase/queries";

const statusColors: Record<string, string> = {
  new: "bg-secondary text-secondary-foreground",
  contacted: "bg-chart-2 text-foreground",
  replied: "bg-chart-3 text-foreground",
  meeting: "bg-chart-4 text-foreground",
  converted: "bg-primary text-primary-foreground",
  unsubscribed: "bg-destructive text-destructive-foreground",
};

interface LeadWithCampaign extends Lead {
  campaign: { id: string; name: string } | null;
}

async function fetchLeads(): Promise<LeadWithCampaign[]> {
  const res = await fetch("/api/leads?limit=5");
  if (!res.ok) throw new Error("Failed to fetch leads");
  return res.json();
}

export function RecentLeads() {
  const { data, isLoading } = useSWR<LeadWithCampaign[]>("recent-leads", fetchLeads, {
    refreshInterval: 30000,
  });

  const recentLeads = data || [];

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
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </>
          ) : recentLeads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No leads yet.</p>
              <Button variant="link" asChild className="mt-2">
                <Link href="/leads">Import your first leads</Link>
              </Button>
            </div>
          ) : (
            recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground truncate">{lead.name}</h4>
                    <Badge className={statusColors[lead.status]} variant="secondary">
                      {lead.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {lead.title} at {lead.company}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground ml-4">
                  {lead.last_contacted 
                    ? new Date(lead.last_contacted).toLocaleDateString()
                    : "Not contacted"}
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
