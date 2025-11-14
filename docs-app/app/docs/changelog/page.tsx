import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import {
  History,
  Sparkles,
  Wrench,
  Bug,
  Zap,
  Code,
  Package,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export const metadata = {
  title: "Changelog - Timepicker-UI",
  description: "All notable changes to Timepicker-UI",
};

interface ChangeItemProps {
  title: string;
  description?: string;
}

function ChangeItem({ title, description }: ChangeItemProps) {
  return (
    <li className="text-sm">
      <strong className="text-foreground">{title}</strong>
      {description && (
        <span className="text-muted-foreground"> - {description}</span>
      )}
    </li>
  );
}

function ChangeSection({
  icon: Icon,
  label,
  color,
  items,
}: {
  icon: any;
  label: string;
  color: string;
  items: ChangeItemProps[];
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
        <Icon className={`h-5 w-5 text-${color}`} />
        {label}
      </h3>

      <ul className="space-y-1 ml-7">
        {items.map((item) => (
          <ChangeItem key={item.title} {...item} />
        ))}
      </ul>
    </div>
  );
}

const CHANGELOG_320 = {
  added: [
    {
      title: "Material Design 3 Ripple Effect",
      description: "Interactive ripple animations on buttons and inputs",
    },
    {
      title: "M3 Color System",
      description: "Complete color token implementation with CSS variables",
    },
    {
      title: "M2 Legacy Theme",
      description: "Material Design 2 theme (theme: 'm2')",
    },
    {
      title: "Mobile Clock Face Toggle",
      description: "Expand/collapse clock face with smooth animations",
    },
    {
      title: "Desktop to Mobile Switching",
      description: "Dynamic view switching via enableSwitchIcon",
    },
    {
      title: "Local SVG Icon Assets",
      description: "Built-in keyboard.svg and schedule.svg icons",
    },
    {
      title: "New ClockSystem Architecture",
      description:
        "Three-layer Engine → Controller → Renderer with RAF batching",
    },
  ],

  changed: [
    {
      title: "Theme Naming (Breaking)",
      description: "Renamed 'm3' → 'm3-green'",
    },
    {
      title: "Option Naming (Breaking)",
      description:
        "Renamed 'switchToMinutesAfterSelectHour' → 'autoSwitchToMinutes'",
    },
    {
      title: "ConfigManager Refactoring",
      description: "Split into 4 modules (87% code reduction)",
    },
    {
      title: "Code Quality",
      description: "KISS/DRY optimization - longest method 225→18 lines (-92%)",
    },
  ],

  fixed: [
    {
      title: "Clock face state bugs",
      description: "Fixed mobile ↔ desktop switching issues",
    },
    {
      title: "Animation performance",
      description: "Removed will-change causing resize lag",
    },
    {
      title: "Angle Jump Bug",
      description: "Fixed Math.atan2() parameter order",
    },
    {
      title: "Disabled minutes styling",
      description: "Visual state now reflects configuration",
    },
    {
      title: "24h positioning",
      description: "Fixed inner/outer circle dimensions",
    },
    {
      title: "24h click overlap",
      description: "Reduced threshold and element size",
    },
    {
      title: "ClockFace disappears early",
      description: "Destroy after modal animation completes",
    },
    {
      title: "Landscape layout",
      description: "Fixed expansion direction and class system",
    },
    {
      title: "Desktop init bug",
      description: "Removed incorrect .mobile class",
    },
    {
      title: "autoSwitchToMinutes regression",
      description: "Fixed feature after ClockSystem refactor",
    },
  ],

  performance: [
    { title: "60fps transitions", description: "Multi-phase RAF scheduling" },
    {
      title: "ClockSystem gains",
      description: "Rendering 15ms→3ms, Drag 8ms→2ms, -25% code size",
    },
  ],
};

export default function ChangelogPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Changelog</h1>
        <p className="text-lg text-muted-foreground">
          All notable changes to this project are documented here
        </p>
      </div>

      <InfoBox
        title="Current Version"
        emoji="🚀"
        variant="purple"
        className="mb-6"
      >
        <strong>v3.2.0</strong> - Released November 14, 2025
      </InfoBox>

      <Section icon={Package} title="Version 3.2.0 - November 13, 2025">
        <div className="space-y-6">
          <ChangeSection
            icon={Sparkles}
            label="Added"
            color="green-500"
            items={CHANGELOG_320.added}
          />

          <ChangeSection
            icon={Wrench}
            label="Changed"
            color="blue-500"
            items={CHANGELOG_320.changed}
          />

          <ChangeSection
            icon={Bug}
            label="Fixed"
            color="red-500"
            items={CHANGELOG_320.fixed}
          />

          <ChangeSection
            icon={Zap}
            label="Performance"
            color="yellow-500"
            items={CHANGELOG_320.performance}
          />

          <div className="bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-lg p-4 border border-orange-500/20">
            <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
              <Code className="h-4 w-4 text-orange-500" />
              Migration Guide
            </h4>

            <p className="text-sm text-muted-foreground mb-3">
              <strong className="text-orange-600 dark:text-orange-400">
                Breaking Changes:
              </strong>
            </p>

            <CodeBlock
              code={`// Theme rename
- theme: 'm3'
+ theme: 'm3-green'

// Option rename  
- switchToMinutesAfterSelectHour: true
+ autoSwitchToMinutes: true`}
              language="diff"
            />
          </div>
        </div>
      </Section>

      <Section icon={History} title="Previous Versions">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-foreground">
                Version 3.1.2
              </h3>
              <span className="text-xs text-muted-foreground">Nov 7, 2025</span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Fixed CSS variable issues with var(--timepicker-text)</li>
              <li>• Resolved input color styling problems</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-foreground">
                Version 3.1.1
              </h3>
              <span className="text-xs text-muted-foreground">Nov 7, 2025</span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Virtual DOM caching - 25% performance improvement</li>
              <li>• RAF batching for smoother animations</li>
              <li>• Input sanitization for XSS protection</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-foreground">
                Version 3.1.0
              </h3>
              <span className="text-xs text-muted-foreground">Nov 7, 2025</span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                • <strong className="text-foreground">EventEmitter API</strong>{" "}
                - on(), once(), off()
              </li>
              <li>• Deprecated DOM events - migrate to EventEmitter</li>
            </ul>
          </div>
        </div>
      </Section>

      <InfoBox title="Full Changelog" emoji="📖" variant="blue">
        View the complete changelog with all versions on{" "}
        <a
          href="https://github.com/pglejzer/timepicker-ui/blob/main/CHANGELOG.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          GitHub
        </a>
      </InfoBox>
    </div>
  );
}
