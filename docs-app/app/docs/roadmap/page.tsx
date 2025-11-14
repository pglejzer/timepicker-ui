import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import {
  Rocket,
  Target,
  Calendar,
  TrendingUp,
  Code,
  Sparkles,
  Zap,
  Package,
  Globe,
  Shield,
} from "lucide-react";

export const metadata = {
  title: "Roadmap - Timepicker-UI",
  description: "Future plans and upcoming features",
};

interface FeatureCardProps {
  title: string;
  description: string;
  status?: "planned" | "in-progress" | "completed";
}

function FeatureCard({
  title,
  description,
  status = "planned",
}: FeatureCardProps) {
  const statusColors = {
    planned: "border-blue-500/20 bg-blue-500/5",
    "in-progress": "border-yellow-500/20 bg-yellow-500/5",
    completed: "border-green-500/20 bg-green-500/5",
  };

  const statusLabels = {
    planned: "Planned",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  const statusTextColors = {
    planned: "text-blue-600 dark:text-blue-400",
    "in-progress": "text-yellow-600 dark:text-yellow-400",
    completed: "text-green-600 dark:text-green-400",
  };

  return (
    <div
      className={`rounded-lg border p-5 ${statusColors[status]} transition-all hover:scale-[1.02]`}
    >
      <div className="flex items-start justify-between mb-2">
        <strong className="text-foreground text-base">{title}</strong>
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${statusTextColors[status]}`}
        >
          {statusLabels[status]}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Roadmap</h1>
        <p className="text-lg text-muted-foreground">
          Planned features and improvements for upcoming releases
        </p>
      </div>

      <InfoBox
        title="Active Development"
        emoji="🚧"
        variant="orange"
        className="mb-6"
      >
        This roadmap is subject to change based on community feedback. Want to
        suggest a feature? Open an issue on{" "}
        <a
          href="https://github.com/pglejzer/timepicker-ui/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          GitHub
        </a>
      </InfoBox>

      <Section icon={Code} title="v3.3.0 - Q1 2026">
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Code Quality Focus
            </span>
          </div>
        </div>

        <div className="grid gap-4 mt-6">
          <FeatureCard
            title="Remove all `any` types"
            description="Replace 17 identified `any` usages with proper TypeScript interfaces and type guards for 100% type safety"
            status="planned"
          />
          <FeatureCard
            title="Remove @internal comments"
            description="Clean up codebase by removing 56 @internal JSDoc comments that are no longer needed"
            status="planned"
          />
          <FeatureCard
            title="Modular refactoring"
            description="Continue splitting large manager classes following ConfigManager pattern - extract EventManager, ClockManager, and ValidationManager into focused modules"
            status="planned"
          />
          <FeatureCard
            title="Constants extraction"
            description="Move magic numbers and strings to dedicated constants files for better maintainability"
            status="planned"
          />
        </div>
      </Section>

      <Section icon={Rocket} title="v4.0.0 - Q2 2026">
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full">
            <Zap className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-600 dark:text-red-400">
              Major Release - Breaking Changes
            </span>
          </div>
        </div>

        <div className="space-y-8 mt-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5 text-green-500" />
              New Features
            </h3>
            <div className="grid gap-4">
              <FeatureCard
                title="Seconds picker"
                description="Add optional seconds selection with HH:MM:SS format support"
                status="planned"
              />
              <FeatureCard
                title="Time range selection"
                description="Select start and end times with validation and conflict detection"
                status="planned"
              />
              <FeatureCard
                title="Enhanced keyboard navigation"
                description="Full keyboard control: arrow keys for time adjustment, Tab/Shift+Tab navigation, Enter/Escape shortcuts"
                status="planned"
              />
              <FeatureCard
                title="Custom time intervals"
                description="Configure minute/second step intervals (e.g., 15-minute increments)"
                status="planned"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5 text-yellow-500" />
              Breaking Changes
            </h3>
            <div className="grid gap-4">
              <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-5">
                <strong className="text-foreground text-base block mb-2">
                  Remove deprecated DOM events
                </strong>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete removal of{" "}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    timepicker:*
                  </code>{" "}
                  DOM events introduced in v3.1.0
                </p>
                <div className="bg-background/50 rounded p-3 border border-border">
                  <p className="text-xs text-muted-foreground">
                    ❌{" "}
                    <code className="text-xs">
                      document.addEventListener('timepicker:open', ...)
                    </code>
                    <br />✅{" "}
                    <code className="text-xs">picker.on('open', ...)</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={Target} title="Future Plans (v4.1+)">
        <div className="grid gap-6">
          <div className="rounded-lg border border-border bg-gradient-to-br from-blue-500/5 to-purple-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Code className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Framework Integrations
              </h3>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Official wrapper libraries for popular frameworks:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-background/70 rounded-md text-sm font-medium border border-border">
                  React
                </span>
                <span className="px-3 py-1.5 bg-background/70 rounded-md text-sm font-medium border border-border">
                  Vue
                </span>
                <span className="px-3 py-1.5 bg-background/70 rounded-md text-sm font-medium border border-border">
                  Angular
                </span>
                <span className="px-3 py-1.5 bg-background/70 rounded-md text-sm font-medium border border-border">
                  Svelte
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-gradient-to-br from-green-500/5 to-teal-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Globe className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Internationalization
              </h3>
            </div>
            <div className="grid gap-3">
              <FeatureCard
                title="RTL Support"
                description="Full right-to-left layout support for Arabic, Hebrew, and other RTL languages"
                status="planned"
              />
              <FeatureCard
                title="Timezone Support"
                description="Handle different timezones with automatic conversion and display"
                status="planned"
              />
              <FeatureCard
                title="Locale Formatting"
                description="Automatic time format detection based on user locale (12h vs 24h)"
                status="planned"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-gradient-to-br from-purple-500/5 to-pink-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Advanced Customization
              </h3>
            </div>
            <div className="grid gap-3">
              <FeatureCard
                title="Custom Clock Faces"
                description="Plugin system for custom clock face designs and behaviors"
                status="planned"
              />
              <FeatureCard
                title="Theme Builder"
                description="Visual theme editor for creating custom color schemes"
                status="planned"
              />
              <FeatureCard
                title="Animation Presets"
                description="Predefined animation styles (bounce, slide, fade) with custom timing"
                status="planned"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section icon={Calendar} title="Release Schedule">
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Patch Releases
                </h3>
                <p className="text-sm text-muted-foreground">v3.x.x</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Bug fixes and minor improvements - released as needed
            </p>
          </div>

          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Package className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Minor Releases
                </h3>
                <p className="text-sm text-muted-foreground">v3.3.0</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              New features, backward compatible - quarterly schedule
            </p>
          </div>

          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Rocket className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Major Releases
                </h3>
                <p className="text-sm text-muted-foreground">v4.0.0</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Breaking changes, major features - yearly with migration guides
            </p>
          </div>

          <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Code className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Beta Releases</h3>
                <p className="text-sm text-muted-foreground">v4.0.0-beta.x</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Early access to new features - 1-2 months before major releases
            </p>
          </div>
        </div>
      </Section>

      <InfoBox title="Contribute" emoji="💡" variant="green">
        Want to help build these features? Check out our{" "}
        <a
          href="https://github.com/pglejzer/timepicker-ui/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Contributing Guide
        </a>{" "}
        to get started!
      </InfoBox>
    </div>
  );
}
