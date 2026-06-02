export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-sidebar border-r border-border relative overflow-hidden">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(96 165 250) 1px, transparent 1px), linear-gradient(90deg, rgb(96 165 250) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow blob */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              className="w-4 h-4 text-primary-foreground"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            LeadRaider
          </span>
        </div>

        {/* Testimonial */}
        <div className="relative space-y-6">
          <blockquote className="text-xl font-medium text-foreground leading-relaxed">
            &ldquo;LeadRaider booked 47 qualified calls in the first month. The AI handles outreach while I focus on closing.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
              JM
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">James Mitchell</p>
              <p className="text-xs text-muted-foreground">Head of Growth, Arbor SaaS</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative grid grid-cols-3 gap-6 pt-6 border-t border-border">
          {[
            { value: "12k+", label: "Leads processed" },
            { value: "38%", label: "Avg reply rate" },
            { value: "4.2x", label: "Pipeline multiplier" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold font-mono text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}
