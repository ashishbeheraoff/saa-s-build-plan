"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Zap,
  MessageSquare,
  Target,
  BarChart3,
  Shield,
  Clock,
  Users,
  CheckCircle2,
  Star,
  Play,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Hero Section
──────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] opacity-30" />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <Badge variant="outline" className="mb-6 px-4 py-1.5 border-primary/30 bg-primary/5 text-primary">
            <Sparkles className="h-3 w-3 mr-2" />
            Now with AI-powered personalization
          </Badge>

          {/* Main headline */}
          <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            <span className="text-foreground">LinkedIn outreach</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              on autopilot
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            Stop spending hours on manual outreach. LeadRaider uses AI to craft personalized messages, 
            qualify leads, and book meetings while you focus on closing deals.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-base px-8 h-12" asChild>
              <Link href="/sign-up">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 h-12 border-border/60 hover:bg-muted/50">
              <Play className="mr-2 h-4 w-4" />
              Watch demo
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[1,2,3,4,5].map((i) => (
                <div 
                  key={i} 
                  className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-muted to-muted-foreground/20"
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <span>Trusted by 2,000+ sales teams</span>
            </div>
          </div>
        </div>

        {/* Hero Image / Dashboard Preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden">
            {/* Mock dashboard header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground">
                  app.leadraider.com
                </div>
              </div>
            </div>
            {/* Dashboard content preview */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Leads Connected", value: "1,284", change: "+12%" },
                  { label: "Reply Rate", value: "38%", change: "+5%" },
                  { label: "Meetings Booked", value: "47", change: "+23%" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border/50 bg-muted/20 p-4">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                    <span className="text-xs text-success">{stat.change}</span>
                  </div>
                ))}
              </div>
              <div className="h-48 rounded-lg border border-border/50 bg-muted/10 flex items-end justify-around px-4 pb-4">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-6 rounded-t bg-gradient-to-t from-primary/60 to-primary"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Logos Section
──────────────────────────────────────────────── */
function LogosSection() {
  const logos = [
    "Stripe", "Vercel", "Linear", "Notion", "Figma", "Slack"
  ];

  return (
    <section className="py-16 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by fast-growing companies worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {logos.map((logo) => (
            <div key={logo} className="text-xl font-semibold text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Features Section
──────────────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Messages",
      description: "Generate hyper-personalized outreach messages using AI that analyzes prospect profiles and company data.",
      gradient: "from-primary/20 to-primary/5",
    },
    {
      icon: Target,
      title: "Smart Lead Scoring",
      description: "Automatically qualify leads based on engagement signals, profile fit, and conversation sentiment.",
      gradient: "from-secondary/20 to-secondary/5",
    },
    {
      icon: MessageSquare,
      title: "Conversation Tracking",
      description: "Follow every conversation in one place with AI-suggested responses and deal stage tracking.",
      gradient: "from-accent/20 to-accent/5",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track campaign performance, reply rates, and conversion metrics with beautiful dashboards.",
      gradient: "from-success/20 to-success/5",
    },
    {
      icon: Shield,
      title: "Safe & Compliant",
      description: "Built-in safety limits and compliance features to protect your LinkedIn account.",
      gradient: "from-warning/20 to-warning/5",
    },
    {
      icon: Clock,
      title: "Timezone Intelligence",
      description: "Automatically send messages at optimal times based on prospect location and activity patterns.",
      gradient: "from-destructive/20 to-destructive/5",
    },
  ];

  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-border/60">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Everything you need to
            <br />
            <span className="text-primary">scale outreach</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete toolkit for modern sales teams to automate prospecting without sacrificing personalization.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="group relative rounded-xl border border-border/50 bg-card/30 p-6 hover:border-border hover:bg-card/50 transition-all duration-300"
            >
              <div className={cn(
                "absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity -z-10",
                feature.gradient
              )} />
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   How It Works Section
──────────────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Connect your LinkedIn",
      description: "Securely link your LinkedIn account in one click. Your credentials are encrypted and never stored.",
    },
    {
      step: "02",
      title: "Define your ideal customer",
      description: "Set targeting criteria like job titles, industries, and company size. Import lead lists or let AI find prospects.",
    },
    {
      step: "03",
      title: "Launch campaigns",
      description: "Create message sequences with AI-generated personalization. Set daily limits and watch connections roll in.",
    },
    {
      step: "04",
      title: "Close more deals",
      description: "Review qualified leads, continue conversations, and book meetings—all from a single dashboard.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-muted/20 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-border/60">
            How it works
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            From zero to booked meetings
            <br />
            <span className="text-primary">in four steps</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-border to-transparent" />
              )}
              <div className="text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Stats Section
──────────────────────────────────────────────── */
function StatsSection() {
  const stats = [
    { value: "38%", label: "Average reply rate", sublabel: "vs 2% industry average" },
    { value: "4.2x", label: "Pipeline growth", sublabel: "within 90 days" },
    { value: "12hrs", label: "Time saved weekly", sublabel: "per sales rep" },
    { value: "89%", label: "Customer satisfaction", sublabel: "NPS score" },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Testimonials Section
──────────────────────────────────────────────── */
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "LeadRaider transformed our outbound strategy. We went from 50 to 200+ qualified meetings per month.",
      author: "Sarah Chen",
      role: "VP of Sales, TechCorp",
      avatar: "SC",
    },
    {
      quote: "The AI personalization is incredible. Our reply rates jumped from 3% to 42% in the first month.",
      author: "Marcus Johnson",
      role: "Founder, GrowthLab",
      avatar: "MJ",
    },
    {
      quote: "Finally, an outreach tool that actually understands compliance. We scaled safely without any account issues.",
      author: "Emily Rodriguez",
      role: "Head of Growth, ScaleUp",
      avatar: "ER",
    },
  ];

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-muted/20 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-border/60">
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Loved by sales teams
            <br />
            <span className="text-primary">worldwide</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div 
              key={t.author}
              className="rounded-xl border border-border/50 bg-card/30 p-6 hover:border-border hover:bg-card/50 transition-all"
            >
              <div className="flex mb-4">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Pricing Section
──────────────────────────────────────────────── */
function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "/month",
      description: "For individuals getting started with outreach",
      features: [
        "1 LinkedIn account",
        "500 connection requests/mo",
        "AI message generation",
        "Basic analytics",
        "Email support",
      ],
      cta: "Start free trial",
      popular: false,
    },
    {
      name: "Pro",
      price: "$149",
      period: "/month",
      description: "For growing sales teams",
      features: [
        "5 LinkedIn accounts",
        "2,500 connection requests/mo",
        "Advanced AI personalization",
        "Team collaboration",
        "CRM integrations",
        "Priority support",
      ],
      cta: "Start free trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Unlimited accounts",
        "Unlimited requests",
        "Custom AI training",
        "Dedicated success manager",
        "SSO & security features",
        "Custom integrations",
      ],
      cta: "Contact sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-border/60">
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Simple, transparent
            <br />
            <span className="text-primary">pricing</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. No credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={cn(
                "relative rounded-xl border p-6 flex flex-col",
                plan.popular 
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                  : "border-border/50 bg-card/30"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most popular</Badge>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className={cn(
                  "w-full",
                  plan.popular ? "bg-primary hover:bg-primary/90" : ""
                )}
                variant={plan.popular ? "default" : "outline"}
                asChild
              >
                <Link href="/sign-up">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CTA Section
──────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative rounded-2xl border border-border/50 bg-card/30 p-8 md:p-16 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-50" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/20 rounded-full blur-[80px] opacity-40" />
          </div>
          
          <div className="relative text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Ready to supercharge
              <br />
              <span className="text-primary">your outreach?</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Join 2,000+ sales teams already using LeadRaider to book more meetings and close more deals.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base px-8 h-12" asChild>
                <Link href="/sign-up">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12 border-border/60">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Landing Page
──────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <LogosSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </>
  );
}
