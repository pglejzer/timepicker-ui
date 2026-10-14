import type { ReactNode } from "react";
import Link from "next/link";
import { Section } from "@/components/section";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { InfoBox } from "@/components/info-box";
import { CodeBlock } from "@/components/code-block";
import { RemovedInV5Table } from "@/components/removed-in-v5-table";
import { V5StylePreview } from "@/components/v5-preview/v5-style-preview";
import { removedItems } from "@/lib/removed-in-v5";
import {
  Rocket,
  Calendar,
  TrendingUp,
  Package,
  ListPlus,
  Sparkles,
  CheckCircle2,
  Puzzle,
  Palette,
  Trash2,
  ListChecks,
  Lightbulb,
  Ban,
  SlidersHorizontal,
  Boxes,
  SwatchBook,
  SunMoon,
  type LucideIcon,
} from "lucide-react";

export const metadata = buildMetadata({
  title: "Roadmap",
  description:
    "What is planned for timepicker-ui 5.0.0 and what has shipped in 4.x.",
  path: "/docs/roadmap",
});

const GITHUB_ISSUES_URL = "https://github.com/pglejzer/timepicker-ui/issues";

const linkClassName = "text-primary hover:underline font-medium";

const registerPluginCode = `import { PluginRegistry } from "timepicker-ui";
import { RangePlugin } from "timepicker-ui/plugins/range";

PluginRegistry.register(RangePlugin);`;

interface FeatureCardProps {
  title: string;
  description: ReactNode;
  status?: "planned" | "idea" | "completed";
}

function FeatureCard({
  title,
  description,
  status = "planned",
}: FeatureCardProps) {
  const statusColors = {
    planned: "border-blue-500/20 bg-blue-500/5",
    idea: "border-border bg-muted/40",
    completed: "border-green-500/20 bg-green-500/5",
  };

  const statusLabels = {
    planned: "Planned",
    idea: "Idea",
    completed: "Completed",
  };

  const statusTextColors = {
    planned: "text-blue-600 dark:text-blue-400",
    idea: "text-muted-foreground",
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
      <div className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </div>
    </div>
  );
}

interface PlanBlockProps {
  icon: LucideIcon;
  title: string;
  gradient: string;
  iconColor: string;
  iconSurface: string;
  id?: string;
  children: ReactNode;
}

function PlanBlock({
  icon: Icon,
  title,
  gradient,
  iconColor,
  iconSurface,
  id,
  children,
}: PlanBlockProps) {
  return (
    <div
      id={id}
      className={`min-w-0 scroll-mt-24 rounded-lg border border-border ${gradient} p-6`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${iconSurface}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <div>
      <PageHeader
        title="Roadmap"
        description="Plans for timepicker-ui 5.0.0 and a list of what has shipped in 4.x."
        eyebrow="Guide"
      />

      <InfoBox
        title="No release date for 5.0.0"
        variant="orange"
        className="mb-6"
      >
        5.0.0 is planned, but it has no release date yet. 4.5.0 prepares for
        it: it adds clearer names for many options and deprecates the items in
        the table under &ldquo;Removed in 5.0&rdquo;. The other planned changes
        are announced
        on this page and in the{" "}
        <Link href="/docs/changelog" className={linkClassName}>
          changelog
        </Link>
        . To suggest a change, open an issue on{" "}
        <a
          href={GITHUB_ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          GitHub
        </a>
        .
      </InfoBox>

      <Section
        icon={Rocket}
        title="Planned for 5.0.0"
        description="5.0.0 is a major release with breaking changes. This section lists what is decided so far. Where a detail is not decided yet, it says so."
      >
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Planned, no release date
            </span>
          </div>
        </div>

        <div className="grid gap-6 mt-6">
          <PlanBlock
            icon={Puzzle}
            title="New plugin system"
            gradient="bg-gradient-to-br from-blue-500/5 to-indigo-500/5"
            iconColor="text-blue-500"
            iconSurface="bg-blue-500/10"
          >
            <p>Today you register a plugin once, at startup:</p>
            <CodeBlock code={registerPluginCode} language="typescript" />
            <p>
              In 5.0, plugins will be built and registered in a different way.
              The new API is not designed yet, so there is no code to show.
            </p>
            <p>
              These exports from <code>timepicker-ui</code> will change:{" "}
              <code>PluginRegistry</code>, <code>Plugin</code>,{" "}
              <code>PluginManager</code>, <code>PluginFactory</code>,{" "}
              <code>TemplateProvider</code>, <code>ClearHandler</code>,{" "}
              <code>CoreState</code> and <code>EventEmitter</code>.
            </p>
            <p>
              The built-in plugins stay: range, timezone and wheel. A migration
              guide ships with 5.0.
            </p>
          </PlanBlock>

          <PlanBlock
            icon={Palette}
            title="CSS class names"
            gradient="bg-gradient-to-br from-purple-500/5 to-pink-500/5"
            iconColor="text-purple-500"
            iconSurface="bg-purple-500/10"
          >
            <p>
              CSS class names keep the <code>tp-ui-</code> prefix. The part
              after the prefix is reworked to follow Material Design component
              naming.
            </p>
            <p>
              Custom CSS that targets these classes will need updating. 5.0
              ships a table of old and new names.
            </p>
          </PlanBlock>

          <PlanBlock
            id="new-style-preview"
            icon={SwatchBook}
            title="New picker style"
            gradient="bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5"
            iconColor="text-violet-500"
            iconSurface="bg-violet-500/10"
          >
            <p>
              5.0 adds a new picker style that you turn on with an option. It
              follows Material Design, like the default <code>basic</code>{" "}
              theme, and does not replace it.
            </p>
            <V5StylePreview />
          </PlanBlock>

          <PlanBlock
            icon={SunMoon}
            title="Light and dark mode"
            gradient="bg-gradient-to-br from-amber-500/5 to-indigo-500/5"
            iconColor="text-amber-500"
            iconSurface="bg-amber-500/10"
          >
            <p>
              A new option, <code>ui.colorScheme</code>, takes{" "}
              <code>&apos;auto&apos;</code>, <code>&apos;light&apos;</code> or{" "}
              <code>&apos;dark&apos;</code> and defaults to{" "}
              <code>&apos;auto&apos;</code>. The picker then matches the page:
              it checks the background behind the input when it opens, then
              the page&apos;s <code>color-scheme</code>, then the system
              setting. An inline picker follows the page when it switches
              modes.
            </p>
            <p>
              Themes that come in a light and a dark version switch on their
              own: <code>basic</code>, the new style, and{" "}
              <code>blueprint</code> with <code>blueprint-dark</code>. Set{" "}
              <code>&apos;light&apos;</code> or <code>&apos;dark&apos;</code>{" "}
              to force one version, for example a dark picker on a light page.
              Themes with a single version ignore the option.
            </p>
            <p>
              The dark version of <code>basic</code> follows the Material
              Design 3 dark color scheme. It replaces the <code>dark</code>{" "}
              theme, which is removed: use{" "}
              <code>ui.colorScheme: &apos;dark&apos;</code> instead. If you
              prefer the current dark look, the 5.0 docs show how to bring it
              back with your own CSS.
            </p>
          </PlanBlock>

          <PlanBlock
            icon={ListPlus}
            title="More planned for 5.0"
            gradient="bg-gradient-to-br from-green-500/5 to-teal-500/5"
            iconColor="text-green-500"
            iconSurface="bg-green-500/10"
          >
            <p>
              These are planned, but their options and details are not decided
              yet.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Forms.</strong> The picker works in a form like{" "}
                <code>{'<input type="time">'}</code>: it submits the time as{" "}
                <code>HH:mm</code> or <code>HH:mm:ss</code> whatever the display
                format, supports <code>required</code> and form reset, and
                fires <code>input</code> and <code>change</code> on the field,
                so form libraries pick up the value.
              </li>
              <li>
                <strong>Minimum and maximum time.</strong> Limits such as{" "}
                <code>min: &apos;now&apos;</code> for bookings, for the common
                cases that need <code>clock.disabledTime</code> today.
              </li>
              <li>
                <strong>Theming from one color.</strong> Set one CSS variable to
                your brand color and the rest of the palette follows, computed
                in CSS. The library styles sit in a cascade layer, so your own
                CSS wins without raising specificity.
              </li>
              <li>
                <strong>Smarter typing.</strong> In an editable input, entries
                such as <code>1430</code>, <code>14.30</code>,{" "}
                <code>2p</code> or <code>2:30pm</code> become a valid time when
                the field loses focus.
              </li>
              <li>
                <strong>Locale from Intl.</strong> AM/PM names, digits and the
                hour format of a locale without shipping translations, and a
                right-to-left layout for languages such as Arabic and Hebrew.
              </li>
              <li>
                <strong>Range.</strong> The duration shown between the two
                times, ranges that cross midnight marked with +1 day, and a
                minimum and maximum length.
              </li>
              <li>
                <strong>Quick picks.</strong> Buttons such as “Now”, “+15 min”
                or times you choose.
              </li>
              <li>
                <strong>Web component.</strong> A{" "}
                <code>{"<timepicker-ui>"}</code> element for frameworks that
                have no wrapper.
              </li>
              <li>
                <strong>Desktop popover and mobile sheet.</strong> On desktop
                the picker opens under the field, and on phones it opens as a
                bottom sheet that you swipe down to close.
              </li>
            </ul>
            <p>
              Quick picks and the web component come as separate imports, so
              they add nothing to your bundle when you do not use them.
            </p>
          </PlanBlock>

          <PlanBlock
            icon={Trash2}
            title="Removed in 5.0"
            gradient="bg-gradient-to-br from-red-500/5 to-orange-500/5"
            iconColor="text-red-500"
            iconSurface="bg-red-500/10"
          >
            <p>Each item below is deprecated in 4.5.0 and removed in 5.0.</p>
            <RemovedInV5Table items={removedItems} />
          </PlanBlock>

          <PlanBlock
            icon={Ban}
            title="Also removed: APIs that do nothing or mislead"
            gradient="bg-gradient-to-br from-rose-500/5 to-pink-500/5"
            iconColor="text-rose-500"
            iconSurface="bg-rose-500/10"
          >
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Internal events in the public <code>TimepickerEventMap</code>:{" "}
                <code>range:minute:commit</code> and <code>animation:*</code>.
                The map also loses its catch-all index signature, so{" "}
                <code>on(&apos;typo&apos;)</code> becomes a type error.
              </li>
              <li>
                <code>behavior.delayHandler</code>. It only delays closing the
                picker. It never debounced the buttons.
              </li>
              <li>
                <code>TimepickerUI.isAvailable()</code>. It does the same as{" "}
                <code>document.querySelector(...) !== null</code>.
              </li>
              <li>
                The undocumented getters <code>hour</code>,{" "}
                <code>minutes</code>, <code>okButton</code>,{" "}
                <code>cancelButton</code> and <code>clockHand</code> on the
                picker instance. They return internal DOM elements.
              </li>
              <li>
                The callback arguments of <code>open(cb)</code> and{" "}
                <code>destroy()</code>, in both forms: <code>destroy(cb)</code>{" "}
                and <code>{"destroy({ callback })"}</code>. Run that code after
                the call, or use{" "}
                <code>picker.once(&apos;open&apos;, ...)</code>.
              </li>
              <li>
                <code>RangeManager</code>, <code>TimezoneManager</code> and{" "}
                <code>WheelManager</code>, exported from the plugin entry
                points. You cannot get an instance of them from a picker today,
                and the new plugin API replaces them.
              </li>
            </ul>
          </PlanBlock>

          <PlanBlock
            icon={SlidersHorizontal}
            title="Options and events"
            gradient="bg-gradient-to-br from-sky-500/5 to-cyan-500/5"
            iconColor="text-sky-500"
            iconSurface="bg-sky-500/10"
          >
            <ul className="list-disc space-y-2 pl-5">
              <li>
                The options renamed in 4.5.0 lose their old names, together
                with the <code>clearBehavior</code> group. The{" "}
                <Link
                  href="/docs/api/options#renamed"
                  className={linkClassName}
                >
                  Renamed in 4.5.0
                </Link>{" "}
                table lists every pair.
              </li>
              <li>
                <code>select:hour</code>, <code>select:minute</code> and{" "}
                <code>select:second</code> fire once when a value of their unit
                is picked, in every mode: on dial release, on an arrow key, on a
                typed value, or when a wheel column stops. Today, in clock mode,
                they fire when a field is activated, so picking an hour on the
                dial fires <code>select:minute</code>. In 5.0, activating a
                field fires only <code>switch:face</code>, which 4.5.0 already
                emits.
              </li>
              <li>
                <code>ui.footer</code> replaces{" "}
                <code>ui.inline.showButtons</code> and{" "}
                <code>wheel.hideFooter</code>. Unset, the OK, Cancel and Clear
                buttons show except in inline mode. <code>false</code> hides
                them in every mode, and <code>true</code> shows them in inline
                mode too.
              </li>
              <li>
                <code>behavior.commitOnChange</code> replaces{" "}
                <code>ui.inline.autoUpdate</code> and{" "}
                <code>wheel.commitOnScroll</code>. Each picked value is written
                to the input and <code>confirm</code> fires with{" "}
                <code>autoCommit: true</code>, and the picker stays open. Unlike{" "}
                <code>inline.autoUpdate</code> today, it emits{" "}
                <code>confirm</code>.
              </li>
              <li>
                <code>behavior.ignoreOutsideClick</code> replaces{" "}
                <code>wheel.ignoreOutsideClick</code> and works in every mode: a
                click outside the picker does not close it. Escape, Cancel and
                OK still do.
              </li>
              <li>
                <code>behavior.returnFocus</code> defaults to{" "}
                <code>true</code>: on close, focus goes back to the input or
                the <code>data-open</code> element that opened the picker.
              </li>
              <li>
                <code>ui.cssClass</code> is applied to one element instead of
                two.
              </li>
            </ul>
          </PlanBlock>

          <PlanBlock
            icon={Boxes}
            title="Package and CSS"
            gradient="bg-gradient-to-br from-slate-500/5 to-zinc-500/5"
            iconColor="text-slate-500"
            iconSurface="bg-slate-500/10"
          >
            <ul className="list-disc space-y-2 pl-5">
              <li>
                The plugins no longer ship UMD builds. The UMD core never
                exposed <code>PluginRegistry</code>, so a plugin loaded from a{" "}
                <code>&lt;script&gt;</code> tag could not be registered. The
                core UMD build stays.
              </li>
              <li>
                About 50 CSS custom properties that no rule reads are removed,
                for example <code>--tp-tertiary-container</code>,{" "}
                <code>--tp-on-tertiary-container</code>,{" "}
                <code>--tp-radius</code>, <code>--tp-hover-bg</code> and 18 of
                the 34 <code>--tp-size-*</code> tokens. Setting them today
                changes nothing. 5.0 lists them all.
              </li>
              <li>
                The <code>./plugins/*</code> wildcard in the{" "}
                <code>exports</code> field of <code>package.json</code> is
                removed. The explicit <code>./plugins/range</code>,{" "}
                <code>./plugins/timezone</code> and{" "}
                <code>./plugins/wheel</code> entries stay, so the plugin imports
                shown in these docs keep working.
              </li>
              <li>
                The <code>crane-straight</code> theme becomes a variant of{" "}
                <code>crane</code> with square corners. The name of the option
                that turns it on is not decided yet.
              </li>
              <li>
                <code>ui.keyboardIcon</code> and <code>ui.clockIcon</code> take
                an element or a factory function instead of an HTML string.
              </li>
            </ul>
          </PlanBlock>

          <PlanBlock
            icon={Package}
            title="Smaller bundle"
            gradient="bg-gradient-to-br from-green-500/5 to-teal-500/5"
            iconColor="text-green-500"
            iconSurface="bg-green-500/10"
          >
            <p>
              5.0 will remove code that is no longer needed: the
              backward-compatibility paths for the deprecated items above, and
              dead code. The goal is less JavaScript to download and parse, for
              the core and for each plugin.
            </p>
            <p>
              4.5.0 already removes internal dead code that has no effect on the
              public API or markup. 5.0 removes the rest, together with the
              items above.
            </p>
            <p>
              No target size is set yet. Current sizes are on the{" "}
              <Link href="/bundle-stats" className={linkClassName}>
                Bundle analysis
              </Link>{" "}
              page.
            </p>
          </PlanBlock>
        </div>
      </Section>

      <Section icon={ListChecks} title="What you can do now">
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            The steps you can take on 4.5.0 to prepare for 5.0 are in the{" "}
            <Link href="/docs/migration-guide-v5" className={linkClassName}>
              Migration Guide v4 to v5
            </Link>
            .
          </p>
          <p>
            If you use or write plugins, open an issue on{" "}
            <a
              href={GITHUB_ISSUES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              GitHub
            </a>{" "}
            and describe the use cases you want the new plugin API to cover.
          </p>
        </div>
      </Section>

      <Section icon={CheckCircle2} title="Released in 4.x">
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Shipped
            </span>
          </div>
        </div>

        <div className="grid gap-4 mt-6">
          <FeatureCard
            title="Plugin system"
            description={
              <>
                Optional plugins for range selection, timezones and the wheel
                UI, registered with <code>PluginRegistry.register()</code>.
                Since 4.3.0, a plugin you do not import is left out of your
                bundle.
              </>
            }
            status="completed"
          />
          <FeatureCard
            title="Range plugin"
            description={
              <>
                Select a start and an end time. <code>range.minDuration</code>{" "}
                and <code>range.maxDuration</code> set the allowed length in
                minutes.
              </>
            }
            status="completed"
          />
          <FeatureCard
            title="Timezone plugin"
            description={
              <>
                A timezone dropdown. <code>timezone.list</code> sets the zones
                it shows.
              </>
            }
            status="completed"
          />
          <FeatureCard
            title="Wheel plugin"
            description={
              <>
                Added in 4.2.0. A scroll-wheel UI instead of the clock face, set
                with <code>ui.mode: &apos;wheel&apos;</code> or{" "}
                <code>&apos;compact-wheel&apos;</code>.
              </>
            }
            status="completed"
          />
          <FeatureCard
            title="Manager architecture"
            description={
              <>
                Internally, the picker is split into eight managers:{" "}
                <code>AnimationManager</code>, <code>ModalManager</code>,{" "}
                <code>ConfigManager</code>, <code>ThemeManager</code>,{" "}
                <code>ValidationManager</code>, <code>EventManager</code>,{" "}
                <code>ClockManager</code> and <code>ClearButtonManager</code>.
              </>
            }
            status="completed"
          />
          <FeatureCard
            title="TypeScript types"
            description={
              <>
                The library is compiled with TypeScript <code>strict</code> mode
                and exports types for the option groups and event payloads.
              </>
            }
            status="completed"
          />
          <FeatureCard
            title="SSR safety"
            description={
              <>
                Safe to import during server-side rendering. Code that needs the
                browser checks for <code>window</code> or <code>document</code>{" "}
                first. Create the picker on the client, for example in{" "}
                <code>useEffect</code>.
              </>
            }
            status="completed"
          />
          <FeatureCard
            title="Blueprint themes"
            description={
              <>
                Added in 4.4.0: <code>blueprint</code> and{" "}
                <code>blueprint-dark</code>. There are now 12 built-in themes.
              </>
            }
            status="completed"
          />
          <FeatureCard
            title="Event API"
            description={
              <>
                <code>picker.on()</code>, <code>picker.once()</code> and{" "}
                <code>picker.off()</code> subscribe to events. They replaced the{" "}
                <code>timepicker:*</code> DOM events, which 4.0.0 removed.
              </>
            }
            status="completed"
          />
          <FeatureCard
            title="Keyboard navigation"
            description={
              <>
                Up and Down arrows, Home, End, Page Up and Page Down change the
                hour and minute. Tab and Shift+Tab stay inside the open picker
                (<code>behavior.focusTrap</code>, on by default). Enter on the
                input opens the picker and Escape closes it.
              </>
            }
            status="completed"
          />
          <FeatureCard
            title="Time steps"
            description={
              <>
                <code>clock.incrementMinutes</code> and{" "}
                <code>clock.incrementHours</code> set the step between
                selectable values.
              </>
            }
            status="completed"
          />
          <FeatureCard
            title="Clock format from the locale"
            description={
              <>
                Added in 4.5.0: <code>clock.type: &apos;auto&apos;</code> picks
                12h or 24h from the browser locale.
              </>
            }
            status="completed"
          />
          <FeatureCard
            title="Clearer option names"
            description={
              <>
                Added in 4.5.0, for example <code>ui.initialView</code> for{" "}
                <code>ui.mobile</code>. The old names work until 5.0, and the{" "}
                <Link
                  href="/docs/api/options#renamed"
                  className={linkClassName}
                >
                  options page
                </Link>{" "}
                lists every pair.
              </>
            }
            status="completed"
          />
        </div>
      </Section>

      <Section
        icon={Lightbulb}
        title="Ideas, not scheduled"
        description="These ideas are not committed to 5.0 or to any other release."
      >
        <div className="grid gap-6">
          <div className="rounded-lg border border-border bg-gradient-to-br from-purple-500/5 to-pink-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Customization
              </h3>
            </div>
            <div className="grid gap-3">
              <FeatureCard
                title="Custom clock faces"
                description="Custom clock face designs and behavior."
                status="idea"
              />
              <FeatureCard
                title="Animation presets"
                description="Predefined animations, such as bounce, slide and fade, with custom timing."
                status="idea"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        icon={Calendar}
        title="How releases work"
        description="Releases happen when they are ready. There is no fixed schedule. Version numbers follow semantic versioning."
      >
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Patch releases
                </h3>
                <p className="text-sm text-muted-foreground">4.x.y</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Bug fixes.</p>
          </div>

          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Package className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Minor releases
                </h3>
                <p className="text-sm text-muted-foreground">4.5.0</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              New features without breaking changes. The{" "}
              <Link href="/docs/changelog" className={linkClassName}>
                changelog
              </Link>{" "}
              lists the changes in 4.5.0.
            </p>
          </div>

          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Rocket className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Major releases
                </h3>
                <p className="text-sm text-muted-foreground">5.0.0</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Breaking changes. 5.0.0 ships with a migration guide.
            </p>
          </div>
        </div>
      </Section>

      <InfoBox title="Contribute" variant="green">
        To work on the code, read the{" "}
        <a
          href="https://github.com/pglejzer/timepicker-ui/blob/main/.github/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          contributing guide
        </a>
        .
      </InfoBox>
    </div>
  );
}
