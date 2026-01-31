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

const CHANGELOG_410 = {
  added: [
    {
      title: "Plugin architecture",
      description:
        "Range and Timezone as optional plugins - import only what you need for smaller bundles",
    },
    {
      title: "Smooth hour snapping",
      description:
        "New smoothHourSnap option (default: true) enables fluid hour dragging with animation",
    },
    {
      title: "Range mode time blocking",
      description:
        "When from time is selected, to picker automatically disables earlier times with visual feedback",
    },
    {
      title: "Timezone dropdown theming",
      description:
        "CSS variables --tp-dropdown-option-bg and --tp-dropdown-option-text for consistent styling",
    },
  ],
  changed: [
    {
      title: "Modular bundle structure",
      description:
        "Core bundle no longer includes Range and Timezone code. Reduces default bundle size",
    },
    {
      title: "Smooth hour dragging is now default",
      description:
        "smoothHourSnap defaults to true. Set to false for legacy discrete jump behavior",
    },
  ],
};

const CHANGELOG_403 = {
  fixed: [
    {
      title: "Desktop/mobile view switching",
      description:
        "Fixed enableSwitchIcon toggle not updating label text (Select time ↔ Enter time), icon (keyboard ↔ schedule), and Hour/Minute label visibility",
    },
  ],
};

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
        <strong>v4.1.0</strong> - Released January 31, 2026
      </InfoBox>

      <Section icon={History} title="Version 4.1.0 - January 31, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Sparkles}
            label="Added"
            color="green-500"
            items={CHANGELOG_410.added}
          />

          <ChangeSection
            icon={Code}
            label="Changed"
            color="blue-500"
            items={CHANGELOG_410.changed}
          />
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.0.3 - January 23, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={CHANGELOG_403.fixed}
          />
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.0.2 - November 23, 2025">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={[
              {
                title: "Firefox Compatibility",
                description:
                  "Fixed 'TouchEvent is not defined' error in DragHandlers - changed from instanceof TouchEvent to 'touches' in event check",
              },
            ]}
          />

          <ChangeSection
            icon={Sparkles}
            label="Added"
            color="green-500"
            items={[
              {
                title: "Exported Grouped Option Types",
                description:
                  "Added exports for TimepickerOptions, ClockOptions, UIOptions, LabelsOptions, BehaviorOptions, CallbacksOptions to support type-safe option composition",
              },
              {
                title: "onUpdate Event Emissions",
                description:
                  "Added missing onUpdate event emissions in EventManager and ClockManager for real-time value synchronization",
              },
            ]}
          />

          <div className="rounded-lg border border-border bg-card p-6 mt-6">
            <h4 className="font-semibold mb-3 text-foreground">
              Firefox Fix Details
            </h4>
            <CodeBlock
              code={`// Before (causing error on Firefox)
if (event instanceof TouchEvent) { // ❌ TouchEvent not defined
  const touch = event.touches[0];
}

// After (cross-browser compatible)
if ('touches' in event) { // ✅ Works everywhere
  const touch = event.touches[0];
}`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.0.1 - November 21, 2025">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={[
              {
                title: "TypeScript Callback Types",
                description:
                  "All callback functions now have proper generic types instead of unknown",
              },
              {
                title: "Type-safe Event Payloads",
                description:
                  "onConfirm, onOpen, onUpdate, and other callbacks now correctly infer event data types",
              },
              {
                title: "Improved IntelliSense",
                description:
                  "Full autocomplete for event data properties without requiring manual type annotations",
              },
            ]}
          />

          <div className="rounded-lg border border-border bg-card p-6 mt-6">
            <h4 className="font-semibold mb-3 text-foreground">
              Before (4.0.0)
            </h4>
            <CodeBlock
              code={`// Callbacks had unknown types
callbacks: {
  onConfirm: (data) => {
    // data: unknown - no autocomplete ❌
    console.log(data.hour); // TypeScript error
  }
}`}
              language="typescript"
            />

            <h4 className="font-semibold mb-3 mt-6 text-foreground">
              After (4.0.1)
            </h4>
            <CodeBlock
              code={`// Callbacks are now properly typed
callbacks: {
  onConfirm: (data) => {
    // data: ConfirmEventData - full autocomplete ✅
    console.log(data.hour); // string | undefined
    console.log(data.minutes); // string | undefined
    console.log(data.type); // string | undefined
  }
}`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <Section icon={Package} title="Version 4.0.0 - November 21, 2025">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-lg p-4 border border-red-500/20 mb-6">
            <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
              <Code className="h-4 w-4 text-red-500" />
              ⚠️ BREAKING CHANGES - Migration Required
            </h4>

            <p className="text-sm text-muted-foreground mb-3">
              <strong className="text-red-600 dark:text-red-400">
                All CSS class names and CSS variable names have been renamed:
              </strong>
            </p>

            <CodeBlock
              code={`// CSS Class Names (ALL classes changed)
- .timepicker-ui-*
+ .tp-ui-*

Examples:
- .timepicker-ui-wrapper       → .tp-ui-wrapper
- .timepicker-ui-modal         → .tp-ui-modal
- .timepicker-ui-clock-face    → .tp-ui-clock-face
- .timepicker-ui-hour          → .tp-ui-hour
- .timepicker-ui-minutes       → .tp-ui-minutes
- .timepicker-ui-am            → .tp-ui-am
- .timepicker-ui-pm            → .tp-ui-pm
- .timepicker-ui-ok-btn        → .tp-ui-ok-btn
- .timepicker-ui-cancel-btn    → .tp-ui-cancel-btn

// CSS Variables (ALL variables changed)
- --timepicker-*
+ --tp-*

Examples:
- --timepicker-bg              → --tp-bg
- --timepicker-primary         → --tp-primary
- --timepicker-text            → --tp-text
- --timepicker-surface         → --tp-surface
- --timepicker-border          → --tp-border
- --timepicker-shadow          → --tp-shadow
- --timepicker-border-radius   → --tp-border-radius
- --timepicker-font-family     → --tp-font-family

// Options Structure (GROUPED)
// v3.x (flat - DEPRECATED):
-{
-  clockType: '24h',
-  theme: 'dark',
-  animation: true,
-  amLabel: 'AM',
-  onConfirm: (data) => {}
-}

// v4.0.0 (grouped - NEW):
+{
+  clock: {
+    type: '24h'
+  },
+  ui: {
+    theme: 'dark',
+    animation: true
+  },
+  labels: {
+    am: 'AM'
+  },
+  callbacks: {
+    onConfirm: (data) => {}
+  }
+}

// Migration Steps:
1. Find & replace all CSS class names in your stylesheets
2. Find & replace all CSS variable names in your custom themes
3. Reorganize options into groups: clock, ui, labels, behavior, callbacks
4. Update clockType → clock.type, theme → ui.theme, onConfirm → callbacks.onConfirm
5. Test all customizations and themes thoroughly`}
              language="diff"
            />

            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                <strong>Important:</strong> The NPM package name remains{" "}
                <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded">
                  timepicker-ui
                </code>
                . Only CSS classes and variables changed.
              </p>
            </div>
          </div>

          <ChangeSection
            icon={Wrench}
            label="Changed (Breaking)"
            color="red-500"
            items={[
              {
                title: "CSS Class Renaming",
                description: "All .timepicker-ui-* classes renamed to .tp-ui-*",
              },
              {
                title: "CSS Variable Renaming",
                description: "All --timepicker-* variables renamed to --tp-*",
              },
              {
                title: "Options Structure Reorganization",
                description:
                  "Options now grouped into: clock, ui, labels, behavior, callbacks",
              },
              {
                title: "Legacy DOM Events Removed",
                description:
                  "timepicker:* custom events completely removed - use EventEmitter API or callbacks",
              },
              {
                title: "setTheme() Method Removed",
                description:
                  "Programmatic theming removed - use CSS classes with CSS variables instead",
              },
            ]}
          />

          <ChangeSection
            icon={Sparkles}
            label="Added"
            color="green-500"
            items={[
              {
                title: "EventEmitter API with Callback Bridge",
                description:
                  "All 9 callback options automatically bridge to EventEmitter with on(), off(), once() methods",
              },
              {
                title: "SSR-Safe Architecture",
                description:
                  "All modules can be imported in Node.js (Next.js, Nuxt, Remix, Astro compatible)",
              },
              {
                title: "Composition-Based Architecture",
                description:
                  "Pure composition with CoreState, Managers, Lifecycle - no inheritance, fully testable",
              },
              {
                title: "Auto-Focus Improvements",
                description:
                  "Modal auto-focuses on open, minutes auto-focus with autoSwitchToMinutes",
              },
              {
                title: "TypeScript Enhancements",
                description:
                  "No any types, fully typed event payloads, grouped options types, stricter type safety",
              },
            ]}
          />

          <ChangeSection
            icon={Wrench}
            label="Changed"
            color="blue-500"
            items={[
              {
                title: "Architecture Refactored",
                description:
                  "Composition-only pattern - removed all extends, pure dependency injection",
              },
              {
                title: "Bundle Size Reduced",
                description: "80 KB → 63.3 KB ESM (-20.9%)",
              },
              {
                title: "Theme Count",
                description:
                  "11 → 10 themes (removed theme-custom from production)",
              },
              {
                title: "Event System Unified",
                description:
                  "Single source of truth - callbacks bridge to EventEmitter automatically",
              },
              {
                title: "Options API Restructured",
                description: "40+ flat options → 5 logical groups",
              },
            ]}
          />

          <ChangeSection
            icon={Package}
            label="Removed"
            color="orange-500"
            items={[
              {
                title: "Legacy DOM Events",
                description:
                  "timepicker:open, timepicker:confirm, timepicker:cancel, etc. - use picker.on() instead",
              },
              {
                title: "setTheme() Method",
                description:
                  "Programmatic theme setting removed - use CSS classes instead",
              },
              {
                title: "theme-custom",
                description:
                  "Removed from production bundle - users create custom themes via CSS variables",
              },
            ]}
          />

          <ChangeSection
            icon={Bug}
            label="Fixed"
            color="red-500"
            items={[
              {
                title: "Focus Trap Auto-Focus",
                description:
                  "Modal wrapper auto-focuses on open (no Tab press needed)",
              },
              {
                title: "Auto-Switch Focus",
                description:
                  "Minute input receives focus when autoSwitchToMinutes enabled",
              },
              {
                title: "SSR Compatibility",
                description:
                  "No DOM globals during initialization - safe for server rendering",
              },
              {
                title: "currentTime Parsing",
                description: "Simplified time parsing for better reliability",
              },
              {
                title: "Dynamic Updates",
                description:
                  "Fixed React useEffect patterns to prevent infinite loops",
              },
            ]}
          />

          <ChangeSection
            icon={Zap}
            label="Benefits"
            color="green-500"
            items={[
              {
                title: "Shorter class names",
                description: "Reduced HTML size and improved readability",
              },
              {
                title: "Smaller bundle",
                description: "-20.9% bundle size reduction (80 KB → 63.3 KB)",
              },
              {
                title: "Better DX",
                description:
                  "Cleaner API with grouped options and EventEmitter",
              },
              {
                title: "SSR Compatible",
                description:
                  "Works seamlessly with Next.js, Nuxt, Remix, Astro",
              },
              {
                title: "Type Safety",
                description: "No any types, fully typed events and options",
              },
            ]}
          />
        </div>
      </Section>

      <Section icon={Package} title="Version 3.2.0 - November 14, 2025">
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
