import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import { PageHeader } from "@/components/page-header";
import { RenamedOptionsTable } from "@/components/renamed-options-table";
import { RemovedInV5Table } from "@/components/removed-in-v5-table";
import { renamedOptions } from "@/lib/renamed-options";
import { removedItems } from "@/lib/removed-in-v5";
import {
  ArrowRight,
  FlaskConical,
  ListChecks,
  Rocket,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

export const metadata = buildMetadata({
  title: "Migration Guide v4 to v5",
  description:
    "Draft guide for moving timepicker-ui from 4.x to 5.0 - renamed options, APIs removed in 5.0, the new returnFocus default and the steps you can take on 4.5.0 today.",
  path: "/docs/migration-guide-v5",
});

const GITHUB_ISSUES_URL = "https://github.com/pglejzer/timepicker-ui/issues";

const linkClassName = "text-primary underline font-medium";

const oldNamesCode = `const picker = new TimepickerUI('#time', {
  clock: { currentTime: true, smoothHourSnap: false },
  ui: { mobile: true, enableSwitchIcon: true },
  behavior: { focusInputAfterClose: true },
  callbacks: {
    onSelectAM: () => console.log('AM'),
    onSelectPM: () => console.log('PM'),
  },
});
picker.create();

picker.update({ options: { ui: { theme: 'dark' } } });`;

const newNamesCode = `const picker = new TimepickerUI('#time', {
  clock: { defaultTime: 'now', discreteHourJump: true },
  ui: { initialView: 'keyboard', viewSwitch: true },
  behavior: { returnFocus: true },
  callbacks: {
    onSelectPeriod: ({ type }) => console.log(type),
  },
});
picker.create();

picker.setOptions({ ui: { theme: 'dark' } });`;

const returnFocusCode = `const picker = new TimepickerUI('#time', {
  behavior: { returnFocus: true },
});
picker.create();`;

const switchFaceCode = `picker.on('switch:face', ({ face }) => {
  console.log(face); // 'hours', 'minutes' or 'seconds'
});`;

export default function MigrationGuideV5Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Guide"
        badge={
          <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--warn)/0.25)] bg-[hsl(var(--warn)/0.06)] px-3 py-1 text-xs font-medium text-[hsl(var(--warn))]">
            <FlaskConical className="h-3.5 w-3.5" />
            Beta
          </span>
        }
        title="Migration Guide v4 to v5"
        description="What 5.0 removes and changes, and what you can update on 4.5.0 today."
      />

      <InfoBox title="This guide is a draft" variant="orange" className="mb-8">
        <p className="mb-3">
          5.0 is not fully designed yet. This guide lists what is decided so
          far and changes as 5.0 takes shape. The final version ships with 5.0.
        </p>
        <p>
          The plan for 5.0 is on the{" "}
          <Link href="/docs/roadmap" className={linkClassName}>
            roadmap
          </Link>
          . If something you use is missing here, open an issue on{" "}
          <a
            href={GITHUB_ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            GitHub
          </a>
          .
        </p>
      </InfoBox>

      <InfoBox title="Still on 3.x?" variant="blue" className="mb-8">
        <p>
          Upgrade to 4.x first with the{" "}
          <Link href="/docs/migration-guide" className={linkClassName}>
            Migration Guide v3 to v4
          </Link>
          . It already uses the option names from 4.5.0.
        </p>
      </InfoBox>

      <Section icon={ListChecks} title="What you can do now">
        <p className="text-muted-foreground mb-4">
          Each step works on 4.5.0, so you can make these changes before 5.0
          is released.
        </p>
        <ol className="list-decimal space-y-3 pl-5 text-sm text-muted-foreground leading-relaxed">
          <li>
            Upgrade to 4.5.0. Your editor shows deprecated APIs with a
            strikethrough. Replace each one using the{" "}
            <a href="#removed" className={linkClassName}>
              Removed in 5.0
            </a>{" "}
            table.
          </li>
          <li>
            Move to the option names from the{" "}
            <a href="#renamed" className={linkClassName}>
              Renamed options
            </a>{" "}
            table, and replace <code>update()</code> with{" "}
            <code>setOptions()</code>.
          </li>
          <li>
            If you use <code>callbacks.onSelectHour</code> or{" "}
            <code>select:hour</code> to
            notice that the clock face changed, use <code>switch:face</code> or{" "}
            <code>callbacks.onSwitchFace</code> instead.
          </li>
          <li>
            Set <code>behavior.returnFocus: true</code>, so the 5.0 default
            does not change how your page behaves. See{" "}
            <a href="#defaults" className={linkClassName}>
              Changed defaults
            </a>
            .
          </li>
          <li>
            Code you pass as a callback to <code>open()</code> or{" "}
            <code>destroy()</code> can run on the line after the call instead.
            5.0 removes these callback arguments.
          </li>
          <li>
            Keep custom CSS that targets <code>tp-ui-*</code> classes in one
            place, so the rename touches as few files as possible.
          </li>
        </ol>
      </Section>

      <Section id="renamed" icon={ArrowRight} title="Renamed options">
        <p className="text-muted-foreground mb-4">
          These options got clearer names in 4.5.0. The old names still work
          and are removed in 5.0. When both names are set, the new one wins.{" "}
          <code className="text-primary">picker.options</code> keeps returning
          the old names until 5.0.
        </p>
        <div className="grid gap-4 lg:grid-cols-2 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Names from 4.0 to 4.4
            </p>
            <CodeBlock language="typescript" code={oldNamesCode} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Names from 4.5.0
            </p>
            <CodeBlock language="typescript" code={newNamesCode} />
          </div>
        </div>
        <RenamedOptionsTable rows={renamedOptions} />
      </Section>

      <Section id="removed" icon={Trash2} title="Removed in 5.0">
        <p className="text-muted-foreground mb-4">
          Each item below is deprecated in 4.5.0 and removed in 5.0. Replace or
          remove it now.
        </p>
        <RemovedInV5Table items={removedItems} />
      </Section>

      <Section id="defaults" icon={SlidersHorizontal} title="Changed defaults">
        <p className="text-muted-foreground mb-4">
          In 5.0, <code>behavior.returnFocus</code> defaults to{" "}
          <code>true</code>: when the picker closes, focus goes back to the
          input, or to the <code>data-open</code> element that opened the
          picker. In 4.5.0 the default is <code>false</code>.
        </p>
        <p className="text-muted-foreground mb-4">
          To opt in now, set it to <code>true</code>. In 4.5.0 this returns
          focus to the input when the picker closes.
        </p>
        <CodeBlock language="typescript" code={returnFocusCode} />
        <p className="text-muted-foreground mt-4">
          If you set <code>behavior.returnFocus: false</code> yourself, the
          new default does not affect you.
        </p>
        <p className="text-muted-foreground mt-4">
          The new <code>ui.colorScheme</code> option defaults to{" "}
          <code>&apos;auto&apos;</code>, so the picker matches a light or dark
          page. On a dark page, <code>basic</code> shows its dark version. To
          keep the light picker everywhere, set{" "}
          <code>ui.colorScheme: &apos;light&apos;</code>. The{" "}
          <Link
            href="/docs/roadmap"
            className="text-primary hover:underline font-medium"
          >
            roadmap
          </Link>{" "}
          describes how the mode is detected.
        </p>
      </Section>

      <Section
        id="other-changes"
        icon={Rocket}
        title="Other changes in 5.0"
        description="Changes the 5.0 plan already describes. Where a detail is not decided yet, it says so."
      >
        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Events and options
            </h3>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                <code>select:hour</code>, <code>select:minute</code> and{" "}
                <code>select:second</code> fire once when a value of their unit
                is picked, in every mode: on dial release, on an arrow key, on
                a typed value, or when a wheel column stops. In 4.5.0, in clock
                mode, they fire when a field is activated. To react to the
                clock face changing, listen to <code>switch:face</code>, which
                4.5.0 already emits:
                <div className="mt-3">
                  <CodeBlock language="typescript" code={switchFaceCode} />
                </div>
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
                <code>autoCommit: true</code>, and the picker stays open. If you
                use <code>ui.inline.autoUpdate</code>, check your{" "}
                <code>confirm</code> handlers: in 4.5.0 it does not emit{" "}
                <code>confirm</code>.
              </li>
              <li>
                <code>behavior.ignoreOutsideClick</code> replaces{" "}
                <code>wheel.ignoreOutsideClick</code> and works in every mode.
                Escape, Cancel and OK still close the picker.
              </li>
              <li>
                <code>ui.cssClass</code> is applied to one element instead of
                two. Check the CSS that uses your class.
              </li>
              <li>
                <code>TimepickerEventMap</code> loses the internal events{" "}
                <code>range:minute:commit</code> and <code>animation:*</code>,
                and its catch-all index signature, so{" "}
                <code>on(&apos;typo&apos;)</code> becomes a type error. Remove
                listeners for those events.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Also removed
            </h3>
            <p className="mb-3">
              Your editor does not flag these in 4.5.0.
            </p>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                <code>behavior.delayHandler</code>. It only delays closing the
                picker. Remove it from your options; 4.5.0 already defaults it
                to <code>0</code>.
              </li>
              <li>
                <code>TimepickerUI.isAvailable()</code>. Use{" "}
                <code>document.querySelector(...) !== null</code>.
              </li>
              <li>
                The undocumented getters <code>hour</code>,{" "}
                <code>minutes</code>, <code>okButton</code>,{" "}
                <code>cancelButton</code> and <code>clockHand</code> on the
                picker instance. They return internal DOM elements. Read the
                time with <code>getValue()</code>.
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
                points. The new plugin API replaces them.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Plugins
            </h3>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                Plugins will be built and registered in a different way. The
                new API is not designed yet. Details will be added here before
                5.0. These exports from <code>timepicker-ui</code> change:{" "}
                <code>PluginRegistry</code>, <code>Plugin</code>,{" "}
                <code>PluginManager</code>, <code>PluginFactory</code>,{" "}
                <code>TemplateProvider</code>, <code>ClearHandler</code>,{" "}
                <code>CoreState</code> and <code>EventEmitter</code>. The
                built-in plugins stay: range, timezone and wheel.
              </li>
              <li>
                Import plugins from <code>timepicker-ui/plugins/range</code>,{" "}
                <code>timepicker-ui/plugins/timezone</code> and{" "}
                <code>timepicker-ui/plugins/wheel</code>. The{" "}
                <code>./plugins/*</code> wildcard in the <code>exports</code>{" "}
                field of <code>package.json</code> is removed. These three
                entries stay.
              </li>
              <li>
                The plugins no longer ship UMD builds. The UMD core never
                exposed <code>PluginRegistry</code>, so a plugin loaded from a{" "}
                <code>&lt;script&gt;</code> tag could not be registered. The
                core UMD build stays.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              CSS and themes
            </h3>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                CSS class names keep the <code>tp-ui-</code> prefix. The part
                after it follows Material Design component names. Custom CSS
                that targets these classes needs updating. The table of old and
                new names will be added here before 5.0.
              </li>
              <li>
                About 50 CSS custom properties that no rule reads are removed,
                for example <code>--tp-tertiary-container</code>,{" "}
                <code>--tp-on-tertiary-container</code>,{" "}
                <code>--tp-radius</code>, <code>--tp-hover-bg</code> and 18 of
                the 34 <code>--tp-size-*</code> tokens. Setting them in 4.5.0
                changes nothing, so you can delete them. 5.0 lists them all.
              </li>
              <li>
                The <code>crane-straight</code> theme becomes a variant of{" "}
                <code>crane</code> with square corners. The name of the option
                that turns it on is not decided yet.
              </li>
              <li>
                The <code>dark</code> theme is removed. Its place is taken by
                the dark version of <code>basic</code>, which follows the
                Material Design 3 dark color scheme. Replace{" "}
                <code>ui.theme: &apos;dark&apos;</code> with{" "}
                <code>ui.colorScheme: &apos;dark&apos;</code>. To keep the
                current dark look, override the styles with your own CSS. The
                CSS needed will be added here before 5.0.
              </li>
              <li>
                5.0 adds an optional new picker style that does not replace the{" "}
                <code>basic</code> theme. The roadmap has a{" "}
                <Link
                  href="/docs/roadmap#new-style-preview"
                  className={linkClassName}
                >
                  design preview
                </Link>
                .
              </li>
              <li>
                <code>ui.keyboardIcon</code> and <code>ui.clockIcon</code> take
                an element or a factory function instead of an HTML string.
                Details will be added here before 5.0.
              </li>
            </ul>
          </div>

          <p>
            For the reasons behind these changes, see the{" "}
            <Link href="/docs/roadmap" className={linkClassName}>
              roadmap
            </Link>
            .
          </p>
        </div>
      </Section>

      <div className="mt-12 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-6">
        <h2 className="text-lg font-semibold mb-2 text-emerald-600 dark:text-emerald-400">
          Need Help?
        </h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/docs/api/options"
              className="text-primary hover:underline"
            >
              Review the Options API Reference
            </Link>
          </li>
          <li>
            <Link href="/docs/roadmap" className="text-primary hover:underline">
              Read the plan for 5.0 on the roadmap
            </Link>
          </li>
          <li>
            <a
              href={GITHUB_ISSUES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Open an issue on GitHub
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
