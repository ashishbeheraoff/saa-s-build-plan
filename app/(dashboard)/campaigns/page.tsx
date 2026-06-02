"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Trash2, 
  Plus,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockCampaigns, type Campaign } from "@/lib/mock-data";

const statusColors = {
  active: "bg-primary text-primary-foreground",
  paused: "bg-warning text-warning-foreground",
  completed: "bg-muted text-muted-foreground",
  draft: "bg-secondary text-secondary-foreground",
};

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = (campaign.completed / campaign.total) * 100;

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link href={`/campaigns/${campaign.id}`}>
              <CardTitle className="text-base font-medium hover:text-primary transition-colors">
                {campaign.name}
              </CardTitle>
            </Link>
            <Badge className={`mt-2 ${statusColors[campaign.status]}`}>
              {campaign.status}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Play className="h-4 w-4 mr-2" />
                Start
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {campaign.objective}
        </p>
        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="font-mono text-lg text-primary">{campaign.qualified}</span>
            <span className="text-muted-foreground">qualified</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-mono text-lg text-foreground">{campaign.connected}</span>
            <span className="text-muted-foreground">connected</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-mono text-lg text-muted-foreground">{campaign.completed}</span>
            <span className="text-muted-foreground">completed</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">
              {campaign.completed} / {campaign.total} leads
            </span>
            <span className="font-mono text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </CardFooter>
    </Card>
  );
}

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground text-sm">
            Manage your outreach campaigns
          </p>
        </div>
        <Button asChild>
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockCampaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}
