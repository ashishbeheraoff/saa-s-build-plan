"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Eye, 
  EyeOff, 
  Save,
  Database,
  Server,
  Container
} from "lucide-react";

const llmSchema = z.object({
  provider: z.enum(["openai", "anthropic", "openai_compatible"]),
  apiKey: z.string().min(1, "API key is required"),
  model: z.string().min(1, "Model is required"),
  baseUrl: z.string().url().optional().or(z.literal("")),
});

const limitsSchema = z.object({
  dailyConnectsGlobal: z.number().min(1).max(500),
  weeklyConnectsGlobal: z.number().min(1).max(2000),
  messagesPerDay: z.number().min(1).max(200),
  cooldownMinutes: z.number().min(1).max(120),
});

type LLMData = z.infer<typeof llmSchema>;
type LimitsData = z.infer<typeof limitsSchema>;

const providerModels = {
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
  anthropic: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
  openai_compatible: ["custom"],
};

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<keyof typeof providerModels>("openai");

  const llmForm = useForm<LLMData>({
    resolver: zodResolver(llmSchema),
    defaultValues: {
      provider: "openai",
      apiKey: "",
      model: "gpt-4o",
      baseUrl: "",
    },
  });

  const limitsForm = useForm<LimitsData>({
    resolver: zodResolver(limitsSchema),
    defaultValues: {
      dailyConnectsGlobal: 100,
      weeklyConnectsGlobal: 400,
      messagesPerDay: 50,
      cooldownMinutes: 30,
    },
  });

  const handleLLMSubmit = (data: LLMData) => {
    console.log("Saving LLM config:", data);
  };

  const handleLimitsSubmit = (data: LimitsData) => {
    console.log("Saving limits:", data);
  };

  const systemHealth = {
    postgres: { status: "healthy", latency: "12ms" },
    redis: { status: "healthy", latency: "3ms" },
    docker: { status: "healthy", containers: 4 },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Configure your LeadRaider instance
        </p>
      </div>

      <Tabs defaultValue="llm" className="space-y-6">
        <TabsList>
          <TabsTrigger value="llm">LLM Config</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        {/* LLM Configuration Tab */}
        <TabsContent value="llm">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>LLM Configuration</CardTitle>
              <CardDescription>
                Configure the AI model used for message generation and lead qualification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={llmForm.handleSubmit(handleLLMSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select
                    value={selectedProvider}
                    onValueChange={(value: keyof typeof providerModels) => {
                      setSelectedProvider(value);
                      llmForm.setValue("provider", value);
                      llmForm.setValue("model", providerModels[value][0]);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="openai_compatible">OpenAI Compatible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="relative">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      placeholder="sk-..."
                      {...llmForm.register("apiKey")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {llmForm.formState.errors.apiKey && (
                    <p className="text-xs text-destructive">
                      {llmForm.formState.errors.apiKey.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select
                    value={llmForm.watch("model")}
                    onValueChange={(value) => llmForm.setValue("model", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {providerModels[selectedProvider].map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProvider === "openai_compatible" && (
                  <div className="space-y-2">
                    <Label htmlFor="baseUrl">Base URL</Label>
                    <Input
                      id="baseUrl"
                      placeholder="https://api.example.com/v1"
                      {...llmForm.register("baseUrl")}
                    />
                    {llmForm.formState.errors.baseUrl && (
                      <p className="text-xs text-destructive">
                        {llmForm.formState.errors.baseUrl.message}
                      </p>
                    )}
                  </div>
                )}

                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Limits Tab */}
        <TabsContent value="limits">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Global Limits</CardTitle>
              <CardDescription>
                Set system-wide limits to prevent rate limiting and account restrictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={limitsForm.handleSubmit(handleLimitsSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dailyConnectsGlobal">Daily Connects (Global)</Label>
                    <Input
                      id="dailyConnectsGlobal"
                      type="number"
                      min={1}
                      max={500}
                      {...limitsForm.register("dailyConnectsGlobal", { valueAsNumber: true })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum connection requests per day across all accounts
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weeklyConnectsGlobal">Weekly Connects (Global)</Label>
                    <Input
                      id="weeklyConnectsGlobal"
                      type="number"
                      min={1}
                      max={2000}
                      {...limitsForm.register("weeklyConnectsGlobal", { valueAsNumber: true })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum connection requests per week across all accounts
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="messagesPerDay">Messages Per Day</Label>
                    <Input
                      id="messagesPerDay"
                      type="number"
                      min={1}
                      max={200}
                      {...limitsForm.register("messagesPerDay", { valueAsNumber: true })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum messages sent per day per account
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cooldownMinutes">Cooldown (Minutes)</Label>
                    <Input
                      id="cooldownMinutes"
                      type="number"
                      min={1}
                      max={120}
                      {...limitsForm.register("cooldownMinutes", { valueAsNumber: true })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum time between actions to appear human-like
                    </p>
                  </div>
                </div>

                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Limits
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about">
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                  Monitor the status of core services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <Database className="h-8 w-8 text-primary" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">PostgreSQL</span>
                        <Badge className="bg-primary text-primary-foreground">
                          {systemHealth.postgres.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        Latency: {systemHealth.postgres.latency}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <Server className="h-8 w-8 text-primary" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Redis</span>
                        <Badge className="bg-primary text-primary-foreground">
                          {systemHealth.redis.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        Latency: {systemHealth.redis.latency}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <Container className="h-8 w-8 text-primary" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Docker</span>
                        <Badge className="bg-primary text-primary-foreground">
                          {systemHealth.docker.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        {systemHealth.docker.containers} containers
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>About LeadRaider</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Version</p>
                    <p className="font-mono">1.0.0-beta</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">License</p>
                    <p className="font-mono">MIT</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Repository</p>
                    <a
                      href="https://github.com/eracle/OpenOutreach"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-mono"
                    >
                      eracle/OpenOutreach
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Documentation</p>
                    <a
                      href="#"
                      className="text-primary hover:underline font-mono"
                    >
                      docs.leadraider.io
                    </a>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    LeadRaider is an open-source LinkedIn outreach automation platform
                    powered by AI agents. It helps sales teams scale personalized
                    outreach while maintaining quality conversations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
