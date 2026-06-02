"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { mockAccounts } from "@/lib/mock-data";

const productSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  objective: z.string().min(10, "Objective must be at least 10 characters"),
  bookingLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const targetSchema = z.object({
  accountId: z.string().min(1, "Please select an account"),
  dailyLimit: z.number().min(1).max(100),
  weeklyLimit: z.number().min(1).max(500),
  freemiumMode: z.boolean(),
});

const seedsSchema = z.object({
  linkedinUrls: z.string().min(1, "Please add at least one LinkedIn URL"),
});

type ProductData = z.infer<typeof productSchema>;
type TargetData = z.infer<typeof targetSchema>;
type SeedsData = z.infer<typeof seedsSchema>;

const steps = [
  { id: 1, name: "Product", description: "Define your offering" },
  { id: 2, name: "Target", description: "Configure limits" },
  { id: 3, name: "Seeds", description: "Add LinkedIn URLs" },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [targetData, setTargetData] = useState<TargetData | null>(null);

  const productForm = useForm<ProductData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      objective: "",
      bookingLink: "",
    },
  });

  const targetForm = useForm<TargetData>({
    resolver: zodResolver(targetSchema),
    defaultValues: {
      accountId: "",
      dailyLimit: 25,
      weeklyLimit: 100,
      freemiumMode: false,
    },
  });

  const seedsForm = useForm<SeedsData>({
    resolver: zodResolver(seedsSchema),
    defaultValues: {
      linkedinUrls: "",
    },
  });

  const linkedinUrls = seedsForm.watch("linkedinUrls");
  const validUrlCount = linkedinUrls
    .split("\n")
    .filter((url) => url.trim().includes("linkedin.com/in/")).length;

  const handleProductSubmit = (data: ProductData) => {
    setProductData(data);
    setCurrentStep(2);
  };

  const handleTargetSubmit = (data: TargetData) => {
    setTargetData(data);
    setCurrentStep(3);
  };

  const handleSeedsSubmit = (data: SeedsData) => {
    // In a real app, this would call the API
    console.log("Creating campaign:", { productData, targetData, seeds: data });
    router.push("/campaigns");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New Campaign</h1>
        <p className="text-muted-foreground text-sm">
          Create a new outreach campaign in 3 steps
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-mono text-sm
                  ${
                    currentStep > step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "border-primary text-primary"
                      : "border-muted text-muted-foreground"
                  }`}
              >
                {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
              </div>
              <div className="hidden sm:block">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-px w-12 sm:w-24 ${
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Product */}
      {currentStep === 1 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={productForm.handleSubmit(handleProductSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Series A Founders Q1"
                  {...productForm.register("name")}
                />
                {productForm.formState.errors.name && (
                  <p className="text-xs text-destructive">
                    {productForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you're offering..."
                  rows={3}
                  {...productForm.register("description")}
                />
                {productForm.formState.errors.description && (
                  <p className="text-xs text-destructive">
                    {productForm.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective">Campaign Objective</Label>
                <Textarea
                  id="objective"
                  placeholder="What do you want to achieve with this campaign?"
                  rows={3}
                  {...productForm.register("objective")}
                />
                {productForm.formState.errors.objective && (
                  <p className="text-xs text-destructive">
                    {productForm.formState.errors.objective.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bookingLink">Booking Link (optional)</Label>
                <Input
                  id="bookingLink"
                  placeholder="https://calendly.com/..."
                  {...productForm.register("bookingLink")}
                />
                {productForm.formState.errors.bookingLink && (
                  <p className="text-xs text-destructive">
                    {productForm.formState.errors.bookingLink.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit">
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Target */}
      {currentStep === 2 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Target Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={targetForm.handleSubmit(handleTargetSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account">LinkedIn Account</Label>
                <Select
                  onValueChange={(value) => targetForm.setValue("accountId", value)}
                  defaultValue={targetForm.getValues("accountId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAccounts
                      .filter((a) => a.status !== "error")
                      .map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.email}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {targetForm.formState.errors.accountId && (
                  <p className="text-xs text-destructive">
                    {targetForm.formState.errors.accountId.message}
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
                    {...targetForm.register("dailyLimit", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyLimit">Weekly Limit</Label>
                  <Input
                    id="weeklyLimit"
                    type="number"
                    min={1}
                    max={500}
                    {...targetForm.register("weeklyLimit", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <Label htmlFor="freemium">Freemium Mode</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Connect without sending messages (slower but safer)
                  </p>
                </div>
                <Switch
                  id="freemium"
                  checked={targetForm.watch("freemiumMode")}
                  onCheckedChange={(checked) => targetForm.setValue("freemiumMode", checked)}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button type="submit">
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Seeds */}
      {currentStep === 3 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Add LinkedIn URLs</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={seedsForm.handleSubmit(handleSeedsSubmit)} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="urls">LinkedIn Profile URLs</Label>
                  <span className="text-xs text-muted-foreground font-mono">
                    {validUrlCount} valid URLs detected
                  </span>
                </div>
                <Textarea
                  id="urls"
                  placeholder="https://linkedin.com/in/profile1&#10;https://linkedin.com/in/profile2&#10;..."
                  rows={10}
                  className="font-mono text-sm"
                  {...seedsForm.register("linkedinUrls")}
                />
                {seedsForm.formState.errors.linkedinUrls && (
                  <p className="text-xs text-destructive">
                    {seedsForm.formState.errors.linkedinUrls.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Paste one LinkedIn profile URL per line
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button type="submit" disabled={validUrlCount === 0}>
                  <Check className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
