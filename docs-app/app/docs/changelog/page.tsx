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
        <strong>v3.2.0</strong> - Released November 13, 2025
      </InfoBox>

      <Section icon={Package} title="Version 3.2.0 - November 13, 2025">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
              <Sparkles className="h-5 w-5 text-green-500" />
              Added
            </h3>
            <ul className="space-y-1 ml-7">
              <ChangeItem
                title="Material Design 3 Ripple Effect"
                description="Interactive ripple animations on buttons and inputs"
              />
              <ChangeItem
                title="M3 Color System"
                description="Complete color token implementation with CSS variables"
              />
              <ChangeItem
                title="M2 Legacy Theme"
                description="Material Design 2 theme (theme: 'm2')"
              />
              <ChangeItem
                title="Mobile Clock Face Toggle"
                description="Expand/collapse clock face with smooth animations"
              />
              <ChangeItem
                title="Desktop to Mobile Switching"
                description="Dynamic view switching via enableSwitchIcon"
              />
              <ChangeItem
                title="Local SVG Icon Assets"
                description="Built-in keyboard.svg and schedule.svg icons"
              />
              <ChangeItem
                title="New ClockSystem Architecture"
                description="Three-layer Engine → Controller → Renderer with RAF batching"
              />
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
              <Wrench className="h-5 w-5 text-blue-500" />
              Changed
            </h3>
            <ul className="space-y-1 ml-7">
              <ChangeItem
                title="Theme Naming (Breaking)"
                description="Renamed 'm3' → 'm3-green'"
              />
              <ChangeItem
                title="Option Naming (Breaking)"
                description="Renamed 'switchToMinutesAfterSelectHour' → 'autoSwitchToMinutes'"
              />
              <ChangeItem
                title="ConfigManager Refactoring"
                description="Split into 4 modules (87% code reduction)"
              />
              <ChangeItem
                title="Code Quality"
                description="KISS/DRY optimization - longest method 225→18 lines (-92%)"
              />
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
              <Bug className="h-5 w-5 text-red-500" />
              Fixed
            </h3>
            <ul className="space-y-1 ml-7">
              <ChangeItem
                title="Clock face state bugs"
                description="Fixed mobile ↔ desktop switching issues"
              />
              <ChangeItem
                title="Animation performance"
                description="Removed will-change causing resize lag"
              />
              <ChangeItem
                title="Angle Jump Bug"
                description="Fixed Math.atan2() parameter order"
              />
              <ChangeItem
                title="Disabled minutes styling"
                description="Visual state now reflects configuration"
              />
              <ChangeItem
                title="24h positioning"
                description="Fixed inner/outer circle dimensions"
              />
              <ChangeItem
                title="24h click overlap"
                description="Reduced threshold and element size"
              />
              <ChangeItem
                title="ClockFace disappears early"
                description="Destroy after modal animation completes"
              />
              <ChangeItem
                title="Landscape layout"
                description="Fixed expansion direction and class system"
              />
              <ChangeItem
                title="Desktop init bug"
                description="Removed incorrect .mobile class"
              />
              <ChangeItem
                title="autoSwitchToMinutes regression"
                description="Fixed feature after ClockSystem refactor"
              />
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
              <Zap className="h-5 w-5 text-yellow-500" />
              Performance
            </h3>
            <ul className="space-y-1 ml-7">
              <ChangeItem
                title="60fps transitions"
                description="Multi-phase RAF scheduling"
              />
              <ChangeItem
                title="ClockSystem gains"
                description="Rendering 15ms→3ms, Drag 8ms→2ms, -25% code size"
              />
            </ul>
          </div>

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
