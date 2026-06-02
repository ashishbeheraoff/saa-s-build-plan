"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  Square, 
  Plus,
  AlertCircle,
  Terminal,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { mockAccounts, mockAccountLogs, type Account } from "@/lib/mock-data";

const statusConfig = {
  running: { color: "bg-primary", label: "Running", pulse: true },
  starting: { color: "bg-warning", label: "Starting", pulse: true },
  stopped: { color: "bg-muted", label: "Stopped", pulse: false },
  error: { color: "bg-destructive", label: "Error", pulse: false },
};

const addAccountSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  dailyLimit: z.number().min(1).max(100),
  weeklyLimit: z.number().min(1).max(500),
});

type AddAccountData = z.infer<typeof addAccountSchema>;

function AccountCard({ account }: { account: Account }) {
  const [isLoading, setIsLoading] = useState(false);
  const status = statusConfig[account.status];

  const handleAction = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-medium">{account.email}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <div className={`h-2 w-2 rounded-full ${status.color} ${status.pulse ? "animate-pulse-dot" : ""}`} />
              <Badge variant="secondary" className="text-xs">
                {status.label}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {account.status === "error" && account.errorMessage && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{account.errorMessage}</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Today</span>
            <p className="font-mono text-lg">
              {account.connectsToday} / {account.dailyLimit}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">This Week</span>
            <p className="font-mono text-lg">
              {account.connectsThisWeek} / {account.weeklyLimit}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Last activity: {new Date(account.lastActivity).toLocaleString()}
        </p>
      </CardContent>
      <CardFooter className="pt-2 gap-2">
        {account.status === "running" || account.status === "starting" ? (
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
            Stop
          </Button>
        ) : (
          <Button 
            size="sm" 
            className="flex-1"
            onClick={handleAction}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Start
          </Button>
        )}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Terminal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[500px] sm:max-w-[500px]">
            <SheetHeader>
              <SheetTitle>Worker Logs</SheetTitle>
              <SheetDescription>{account.email}</SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] mt-4">
              <div className="font-mono text-xs space-y-1 bg-background p-4 rounded-lg">
                {mockAccountLogs.map((log, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-muted-foreground shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span
                      className={
                        log.level === "error"
                          ? "text-destructive"
                          : log.level === "warning"
                          ? "text-warning"
                          : log.level === "success"
                          ? "text-primary"
                          : "text-foreground"
                      }
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
}

function AddAccountDialog() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AddAccountData>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      email: "",
      password: "",
      dailyLimit: 25,
      weeklyLimit: 100,
    },
  });

  const onSubmit = (data: AddAccountData) => {
    console.log("Adding account:", data);
    setOpen(false);
    form.reset();
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
          <DialogTitle>Add LinkedIn Account</DialogTitle>
          <DialogDescription>
            Add a new LinkedIn account for outreach automation
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">LinkedIn Email</Label>
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...form.register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="weeklyLimit">Weekly Limit</Label>
                <Input
                  id="weeklyLimit"
                  type="number"
                  min={1}
                  max={500}
                  {...form.register("weeklyLimit", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Account</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground text-sm">
            Manage your LinkedIn accounts and workers
          </p>
        </div>
        <AddAccountDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockAccounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
