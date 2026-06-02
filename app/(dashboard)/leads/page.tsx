"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  ExternalLink, 
  X,
  Ban,
  Download,
  FileText,
  Sheet,
  ChevronDown,
} from "lucide-react";
import type { Lead, Campaign } from "@/lib/supabase/queries";
import { updateLead } from "@/lib/supabase/mutations";

interface LeadWithCampaign extends Lead {
  campaign: { id: string; name: string } | null;
}

const statusColors: Record<string, string> = {
  new: "bg-secondary text-secondary-foreground",
  contacted: "bg-chart-2 text-foreground",
  replied: "bg-chart-3 text-foreground",
  meeting: "bg-chart-4 text-foreground",
  converted: "bg-primary text-primary-foreground",
  unsubscribed: "bg-destructive text-destructive-foreground",
};

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "replied", label: "Replied" },
  { value: "meeting", label: "Meeting" },
  { value: "converted", label: "Converted" },
  { value: "unsubscribed", label: "Unsubscribed" },
];

const EXPORT_COLUMNS = ["Name", "Title", "Company", "Email", "Campaign", "Status", "Last Contacted"];

function leadsToRows(leads: LeadWithCampaign[]) {
  return leads.map((lead) => [
    lead.name,
    lead.title || "",
    lead.company || "",
    lead.email,
    lead.campaign?.name || "No campaign",
    lead.status,
    lead.last_contacted ? new Date(lead.last_contacted).toLocaleDateString() : "Never",
  ]);
}

function exportCSV(leads: LeadWithCampaign[], filename = "leads") {
  const rows = [EXPORT_COLUMNS, ...leadsToRows(leads)];
  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportPDF(leads: LeadWithCampaign[], filename = "leads") {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text("LeadRaider — Leads Export", 14, 16);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Exported ${new Date().toLocaleString()} · ${leads.length} leads`, 14, 22);
  autoTable(doc, {
    startY: 28,
    head: [EXPORT_COLUMNS],
    body: leadsToRows(leads),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 250] },
  });
  doc.save(`${filename}.pdf`);
}

async function fetchLeads(): Promise<LeadWithCampaign[]> {
  const res = await fetch("/api/leads");
  if (!res.ok) throw new Error("Failed to fetch leads");
  return res.json();
}

async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await fetch("/api/campaigns");
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return res.json();
}

export default function LeadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [campaignFilter, setCampaignFilter] = useState(searchParams.get("campaign") || "all");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [showUnsubscribed, setShowUnsubscribed] = useState(
    searchParams.get("unsubscribed") === "true"
  );
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const { data: leads, isLoading: leadsLoading, mutate } = useSWR<LeadWithCampaign[]>("leads", fetchLeads);
  const { data: campaigns, isLoading: campaignsLoading } = useSWR<Campaign[]>("campaigns", fetchCampaigns);

  const isLoading = leadsLoading || campaignsLoading;

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/leads?${params.toString()}`, { scroll: false });
  };

  const filteredLeads = useMemo(() => {
    return (leads || []).filter((lead) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          lead.name.toLowerCase().includes(query) ||
          (lead.company?.toLowerCase().includes(query) || false) ||
          (lead.title?.toLowerCase().includes(query) || false);
        if (!matchesSearch) return false;
      }

      // Campaign filter
      if (campaignFilter !== "all" && lead.campaign_id !== campaignFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && lead.status !== statusFilter) {
        return false;
      }

      // Unsubscribed toggle
      if (!showUnsubscribed && lead.status === "unsubscribed") {
        return false;
      }

      return true;
    });
  }, [leads, searchQuery, campaignFilter, statusFilter, showUnsubscribed]);

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map((l) => l.id));
    }
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleBulkUnsubscribe = async () => {
    try {
      await Promise.all(
        selectedLeads.map((id) => updateLead(id, { status: "unsubscribed" }))
      );
      setSelectedLeads([]);
      mutate();
    } catch (error) {
      console.error("Failed to unsubscribe leads:", error);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCampaignFilter("all");
    setStatusFilter("all");
    setShowUnsubscribed(false);
    router.push("/leads");
  };

  const hasActiveFilters =
    searchQuery || campaignFilter !== "all" || statusFilter !== "all" || showUnsubscribed;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-muted-foreground text-sm">
            View and manage all your leads across campaigns
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              <Download className="h-4 w-4" />
              Export
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              {selectedLeads.length > 0
                ? `${selectedLeads.length} selected leads`
                : `All ${filteredLeads.length} filtered leads`}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => {
                const toExport = selectedLeads.length > 0
                  ? filteredLeads.filter((l) => selectedLeads.includes(l.id))
                  : filteredLeads;
                exportCSV(toExport);
              }}
            >
              <Sheet className="h-4 w-4 text-chart-2" />
              Download as CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => {
                const toExport = selectedLeads.length > 0
                  ? filteredLeads.filter((l) => selectedLeads.includes(l.id))
                  : filteredLeads;
                exportPDF(toExport);
              }}
            >
              <FileText className="h-4 w-4 text-destructive" />
              Download as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateUrl({ q: e.target.value });
                }}
                className="pl-10"
              />
            </div>

            <Select
              value={campaignFilter}
              onValueChange={(value) => {
                setCampaignFilter(value);
                updateUrl({ campaign: value });
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {(campaigns || []).map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                updateUrl({ status: value });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={showUnsubscribed}
                onCheckedChange={(checked) => {
                  setShowUnsubscribed(!!checked);
                  updateUrl({ unsubscribed: checked ? "true" : null });
                }}
              />
              <span className="text-sm">Show unsubscribed</span>
            </label>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                <span className="font-mono font-bold">{selectedLeads.length}</span> leads selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkUnsubscribe}
              >
                <Ban className="h-4 w-4 mr-2" />
                Unsubscribe Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leads Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {filteredLeads.length} leads found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      filteredLeads.length > 0 &&
                      selectedLeads.length === filteredLeads.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Contacted</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))}
                </>
              ) : filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No leads found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={() => handleSelectLead(lead.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.title || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.company || "-"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {lead.campaign?.name || "No campaign"}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[lead.status]} variant="secondary">
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {lead.last_contacted 
                        ? new Date(lead.last_contacted).toLocaleDateString()
                        : "Never"}
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
