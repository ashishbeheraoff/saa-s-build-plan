"use client";

import useSWR from "swr";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import type { Campaign } from "@/lib/supabase/queries";

const statusColors = {
  active: "bg-primary text-primary-foreground",
  paused: "bg-warning text-warning-foreground",
  completed: "bg-muted text-muted-foreground",
  draft: "bg-secondary text-secondary-foreground",
};

async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await fetch("/api/campaigns");
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return res.json();
}

export function RecentCampaigns() {
  const { data, isLoading } = useSWR<Campaign[]>("campaigns", fetchCampaigns, {
    refreshInterval: 30000,
  });

  const recentCampaigns = (data || []).slice(0, 3);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Recent Campaigns</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/campaigns" className="flex items-center gap-1">
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg border border-border">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex gap-4 mb-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-1 w-full" />
              </div>
            ))}
          </>
        ) : recentCampaigns.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No campaigns yet.</p>
            <Button variant="link" asChild className="mt-2">
              <Link href="/campaigns/new">Create your first campaign</Link>
            </Button>
          </div>
        ) : (
          recentCampaigns.map((campaign) => {
            const progress = campaign.total_leads > 0 
              ? (campaign.contacted / campaign.total_leads) * 100 
              : 0;
            return (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="block p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">{campaign.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      {campaign.type} campaign
                    </p>
                  </div>
                  <Badge className={statusColors[campaign.status]}>
                    {campaign.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs">
                  <span className="text-muted-foreground">
                    <span className="font-mono text-foreground">{campaign.replied}</span> replied
                  </span>
                  <span className="text-muted-foreground">
                    <span className="font-mono text-foreground">{campaign.meetings}</span> meetings
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-mono text-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1" />
                </div>
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
