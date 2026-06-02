"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import { mockCampaigns } from "@/lib/mock-data";

const statusColors = {
  active: "bg-primary text-primary-foreground",
  paused: "bg-warning text-warning-foreground",
  completed: "bg-muted text-muted-foreground",
  draft: "bg-secondary text-secondary-foreground",
};

export function RecentCampaigns() {
  const recentCampaigns = mockCampaigns.slice(0, 3);

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
        {recentCampaigns.map((campaign) => {
          const progress = (campaign.completed / campaign.total) * 100;
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
                    {campaign.objective}
                  </p>
                </div>
                <Badge className={statusColors[campaign.status]}>
                  {campaign.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <span className="text-muted-foreground">
                  <span className="font-mono text-foreground">{campaign.qualified}</span> qualified
                </span>
                <span className="text-muted-foreground">
                  <span className="font-mono text-foreground">{campaign.connected}</span> connected
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
        })}
      </CardContent>
    </Card>
  );
}
