"use client";

import { useState } from "react";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Play, 
  Square, 
  Plus,
  AlertCircle,
  Loader2,
  Mail,
  Linkedin,
  Twitter,
} from "lucide-react";
import type { Account } from "@/lib/supabase/queries";
import { createAccount, updateAccount } from "@/lib/supabase/mutations";

const statusConfig = {
  active: { color: "bg-primary", label: "Active", pulse: true },
  paused: { color: "bg-warning", label: "Paused", pulse: false },
  disconnected: { color: "bg-destructive", label: "Disconnected", pulse: false },
};

const platformIcons = {
  gmail: Mail,
  outlook: Mail,
  linkedin: Linkedin,
  twitter: Twitter,
};

const addAccountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  platform: z.enum(["gmail", "outlook", "linkedin", "twitter"]),
  dailyLimit: z.number().min(1).max(100),
});

type AddAccountData = z.infer<typeof addAccountSchema>;

async function fetchAccounts(): Promise<Account[]> {
  const res = await fetch("/api/accounts");
  if (!res.ok) throw new Error("Failed to fetch accounts");
  return res.json();
}

function AccountCard({ account, onUpdate }: { account: Account; onUpdate: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const status = statusConfig[account.status];
  const PlatformIcon = platformIcons[account.platform];

  const handleAction = async () => {
    setIsLoading(true);
    try {
      const newStatus = account.status === "active" ? "paused" : "active";
      await updateAccount(account.id, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error("Failed to update account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <PlatformIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-medium">{account.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{account.email}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className={`h-2 w-2 rounded-full ${status.color} ${status.pulse ? "animate-pulse" : ""}`} />
          <Badge variant="secondary" className="text-xs">
            {status.label}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {account.platform}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {account.status === "disconnected" && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Account disconnected. Please reconnect to continue.</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Today</span>
            <p className="font-mono text-lg">
              {account.sent_today} / {account.daily_limit}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Health</span>
            <p className="font-mono text-lg">
              {account.health_score}%
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Last activity: {new Date(account.last_activity).toLocaleString()}
        </p>
      </CardContent>
      <CardFooter className="pt-2 gap-2">
        {account.status === "active" ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleAction}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Square className="h-4 w-4 mr-2" />
            )}
            Pause
          </Button>
        ) : (
          <Button 
            size="sm" 
            className="flex-1"
            onClick={handleAction}
            disabled={isLoading || account.status === "disconnected"}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {account.status === "disconnected" ? "Reconnect" : "Start"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function AccountSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}

function AddAccountDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddAccountData>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      name: "",
      email: "",
      platform: "gmail",
      dailyLimit: 25,
    },
  });

  const onSubmit = async (data: AddAccountData) => {
    setIsSubmitting(true);
    try {
      await createAccount({
        name: data.name,
        platform: data.platform,
        email: data.email,
      });
      setOpen(false);
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Failed to create account:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogDescription>
            Add a new email or social account for outreach automation
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                placeholder="My Work Email"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={form.watch("platform")}
                onValueChange={(value: AddAccountData["platform"]) => form.setValue("platform", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gmail">Gmail</SelectItem>
                  <SelectItem value="outlook">Outlook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailyLimit">Daily Limit</Label>
              <Input
                id="dailyLimit"
                type="number"
                min={1}
                max={100}
                {...form.register("dailyLimit", { valueAsNumber: true })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AccountsPage() {
  const { data, isLoading, mutate } = useSWR<Account[]>("accounts", fetchAccounts);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground text-sm">
            Manage your email and social accounts
          </p>
        </div>
        <AddAccountDialog onSuccess={mutate} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <AccountSkeleton key={i} />
            ))}
          </>
        ) : (data || []).length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <p className="text-muted-foreground mb-4">No accounts yet. Add your first account to get started.</p>
            <AddAccountDialog onSuccess={mutate} />
          </Card>
        ) : (
          (data || []).map((account) => (
            <AccountCard key={account.id} account={account} onUpdate={mutate} />
          ))
        )}
      </div>
    </div>
  );
}
