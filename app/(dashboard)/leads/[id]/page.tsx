"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  ArrowLeft, 
  ExternalLink, 
  Ban,
  Building,
  Briefcase,
  Calendar
} from "lucide-react";
import { mockLeads, mockMessages, mockCampaigns } from "@/lib/mock-data";

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

const stateOptions = [
  "new",
  "connected",
  "messaged",
  "replied",
  "qualified",
  "meeting_booked",
  "converted",
  "disqualified",
];

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const lead = mockLeads.find((l) => l.id === id);
  const messages = mockMessages.filter((m) => m.leadId === id);
  const campaign = mockCampaigns.find((c) => c.id === lead?.campaignId);

  const [currentState, setCurrentState] = useState(lead?.state || "new");

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground">Lead not found</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/leads">Back to Leads</Link>
        </Button>
      </div>
    );
  }

  const handleDisqualify = () => {
    setCurrentState("disqualified");
    console.log("Disqualifying lead:", lead.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/leads">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
            <Badge className={stateColors[currentState]}>
              {currentState.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {lead.title} at {lead.company}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            LinkedIn
          </a>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat History - 2 columns */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Conversation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No messages yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "bot" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${
                            message.sender === "bot"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-2 ${
                              message.sender === "bot"
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-4">
          {/* Lead Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{lead.company}</p>
                  <p className="text-xs text-muted-foreground">Company</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{lead.title}</p>
                  <p className="text-xs text-muted-foreground">Title</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium font-mono">
                    {new Date(lead.lastMessageAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Last Activity</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Campaign</p>
                <Link
                  href={`/campaigns/${campaign?.id}`}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {campaign?.name}
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* State Override */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium">State Override</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={currentState}
                onValueChange={(value) => {
                  setCurrentState(value);
                  console.log("Updating lead state:", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Separator />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={currentState === "disqualified"}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Disqualify Lead
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Disqualify this lead?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will mark {lead.name} as disqualified and stop all automated
                      outreach. This action can be reversed by changing the state.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDisqualify}>
                      Disqualify
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* Deal Info (placeholder) */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Deal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No deal created yet. A deal will be created automatically when the lead
                reaches the meeting_booked state.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
