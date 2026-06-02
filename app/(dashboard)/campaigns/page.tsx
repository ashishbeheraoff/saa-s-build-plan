"use client";

import useSWR from "swr";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
import type { Campaign } from "@/lib/supabase/queries";
import { updateCampaign, deleteCampaign } from "@/lib/supabase/mutations";

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

function CampaignCard({ campaign, onUpdate }: { campaign: Campaign; onUpdate: () => void }) {
  const progress = campaign.total_leads > 0 
    ? (campaign.contacted / campaign.total_leads) * 100 
    : 0;

  const handleStatusChange = async (newStatus: Campaign["status"]) => {
    try {
      await updateCampaign(campaign.id, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error("Failed to update campaign:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await deleteCampaign(campaign.id);
      onUpdate();
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    }
  };

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
              <DropdownMenuItem onClick={() => handleStatusChange("active")}>
                <Play className="h-4 w-4 mr-2" />
                Start
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("paused")}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {campaign.type} campaign • {campaign.reply_rate}% reply rate
        </p>
        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="font-mono text-lg text-primary">{campaign.replied}</span>
            <span className="text-muted-foreground">replied</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-mono text-lg text-foreground">{campaign.meetings}</span>
            <span className="text-muted-foreground">meetings</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-mono text-lg text-muted-foreground">{campaign.contacted}</span>
            <span className="text-muted-foreground">contacted</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">
              {campaign.contacted} / {campaign.total_leads} leads
            </span>
            <span className="font-mono text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </CardFooter>
    </Card>
  );
}

function CampaignSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-5 w-16" />
      </CardHeader>
      <CardContent className="pb-2">
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Skeleton className="h-2 w-full" />
      </CardFooter>
    </Card>
  );
}

export default function CampaignsPage() {
  const { data, isLoading, mutate } = useSWR<Campaign[]>("campaigns", fetchCampaigns);

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
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CampaignSkeleton key={i} />
            ))}
          </>
        ) : (data || []).length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <p className="text-muted-foreground mb-4">No campaigns yet. Create your first campaign to get started.</p>
            <Button asChild>
              <Link href="/campaigns/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Link>
            </Button>
          </Card>
        ) : (
          (data || []).map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} onUpdate={mutate} />
          ))
        )}
      </div>
    </div>
  );
}
