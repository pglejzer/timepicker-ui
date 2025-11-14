"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import { Settings, Code2, Clock, Lock, Type, Layout } from "lucide-react";
import { notFound } from "next/navigation";

interface Config {
  clockType: string;
  theme: string;
  animation: boolean;
  backdrop: boolean;
  mobile: boolean;
  editable: boolean;
  focusTrap: boolean;
  enableScrollbar: boolean;
  enableSwitchIcon: boolean;
  autoSwitchToMinutes: boolean;
  focusInputAfterCloseModal: boolean;
  incrementHours: number;
  incrementMinutes: number;
  okLabel: string;
  cancelLabel: string;
  timeLabel: string;
  amLabel: string;
  pmLabel: string;
  inlineEnabled: boolean;
  inlineShowButtons: boolean;
  inlineAutoUpdate: boolean;
  disabledHours: string;
  disabledMinutes: string;
  disabledInterval: string;
  currentTimeEnabled: boolean;
}

interface SelectOption {
  value: string;
  label: string;
}

interface NumberOption {
  value: number;
  label: string;
}

interface CheckboxConfig {
  key: keyof Config;
  label: string;
  description?: string;
}

interface InputConfig {
  key: keyof Config;
  label: string;
  placeholder: string;
}

const CLOCK_TYPES: SelectOption[] = [
  { value: "12h", label: "12-hour" },
  { value: "24h", label: "24-hour" },
];

const THEMES: SelectOption[] = [
  { value: "basic", label: "Basic" },
  { value: "dark", label: "Dark" },
  { value: "crane", label: "Crane" },
  { value: "crane-straight", label: "Crane Straight" },
  { value: "m3-green", label: "Material 3 Green" },
  { value: "m2", label: "Material 2" },
  { value: "glassmorphic", label: "Glassmorphic" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "ai", label: "AI" },
  { value: "pastel", label: "Pastel" },
];

const INCREMENT_HOURS: NumberOption[] = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
];

const INCREMENT_MINUTES: NumberOption[] = [
  { value: 1, label: "1" },
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
];

const BASIC_CHECKBOXES: CheckboxConfig[] = [
  {
    key: "animation",
    label: "Animation",
    description: "Enable open/close animations",
  },
  { key: "backdrop", label: "Backdrop", description: "Show modal overlay" },
  { key: "mobile", label: "Force Mobile", description: "Use mobile version" },
  { key: "editable", label: "Editable", description: "Allow manual input" },
];

const BEHAVIOR_CHECKBOXES: CheckboxConfig[] = [
  { key: "focusTrap", label: "Focus Trap", description: "Trap focus in modal" },
  {
    key: "enableScrollbar",
    label: "Enable Scrollbar",
    description: "Keep page scroll",
  },
  {
    key: "enableSwitchIcon",
    label: "Switch Icon",
    description: "Show mobile/desktop toggle",
  },
  {
    key: "autoSwitchToMinutes",
    label: "Auto-switch Minutes",
    description: "After hour selection",
  },
  {
    key: "focusInputAfterCloseModal",
    label: "Focus After Close",
    description: "Focus input on close",
  },
];

const INLINE_CHECKBOXES: CheckboxConfig[] = [
  {
    key: "inlineEnabled",
    label: "Enable Inline",
    description: "Always visible picker",
  },
  {
    key: "inlineShowButtons",
    label: "Show Buttons",
    description: "Show OK/Cancel buttons",
  },
  {
    key: "inlineAutoUpdate",
    label: "Auto Update",
    description: "Update on change",
  },
];

const LABEL_INPUTS: InputConfig[] = [
  { key: "okLabel", label: "OK Label", placeholder: "OK" },
  { key: "cancelLabel", label: "Cancel Label", placeholder: "Cancel" },
  { key: "timeLabel", label: "Time Label", placeholder: "Select time" },
  { key: "amLabel", label: "AM Label", placeholder: "AM" },
  { key: "pmLabel", label: "PM Label", placeholder: "PM" },
];

const DISABLED_INPUTS: InputConfig[] = [
  {
    key: "disabledHours",
    label: "Disabled Hours",
    placeholder: "e.g., 1,3,5,8",
  },
  {
    key: "disabledMinutes",
    label: "Disabled Minutes",
    placeholder: "e.g., 15,30,45",
  },
  {
    key: "disabledInterval",
    label: "Disabled Interval",
    placeholder: "e.g., 10:00 AM - 2:00 PM",
  },
];

const DEFAULT_CONFIG: Config = {
  clockType: "12h",
  theme: "basic",
  animation: true,
  backdrop: true,
  mobile: false,
  editable: false,
  focusTrap: true,
  enableScrollbar: false,
  enableSwitchIcon: false,
  autoSwitchToMinutes: true,
  focusInputAfterCloseModal: false,
  incrementHours: 1,
  incrementMinutes: 1,
  okLabel: "",
  cancelLabel: "",
  timeLabel: "",
  amLabel: "",
  pmLabel: "",
  inlineEnabled: false,
  inlineShowButtons: false,
  inlineAutoUpdate: true,
  disabledHours: "",
  disabledMinutes: "",
  disabledInterval: "",
  currentTimeEnabled: false,
};

function generateCode(config: Config): string {
  const options: string[] = [];

  if (config.clockType !== "12h") {
    options.push(`clockType: '${config.clockType}'`);
  }
  if (config.theme !== "basic") {
    options.push(`theme: '${config.theme}'`);
  }
  if (!config.animation) {
    options.push(`animation: false`);
  }
  if (!config.backdrop) {
    options.push(`backdrop: false`);
  }
  if (config.mobile) {
    options.push(`mobile: true`);
  }
  if (config.editable) {
    options.push(`editable: true`);
  }
  if (!config.focusTrap) {
    options.push(`focusTrap: false`);
  }
  if (config.enableScrollbar) {
    options.push(`enableScrollbar: true`);
  }
  if (config.enableSwitchIcon) {
    options.push(`enableSwitchIcon: true`);
  }
  if (!config.autoSwitchToMinutes) {
    options.push(`autoSwitchToMinutes: false`);
  }
  if (config.focusInputAfterCloseModal) {
    options.push(`focusInputAfterCloseModal: true`);
  }
  if (config.incrementHours !== 1) {
    options.push(`incrementHours: ${config.incrementHours}`);
  }
  if (config.incrementMinutes !== 1) {
    options.push(`incrementMinutes: ${config.incrementMinutes}`);
  }

  if (config.okLabel) {
    options.push(`okLabel: '${config.okLabel}'`);
  }
  if (config.cancelLabel) {
    options.push(`cancelLabel: '${config.cancelLabel}'`);
  }
  if (config.timeLabel) {
    options.push(`timeLabel: '${config.timeLabel}'`);
  }
  if (config.amLabel) {
    options.push(`amLabel: '${config.amLabel}'`);
  }
  if (config.pmLabel) {
    options.push(`pmLabel: '${config.pmLabel}'`);
  }

  if (config.inlineEnabled) {
    const inlineOpts: string[] = ["enabled: true"];
    if (!config.inlineShowButtons) inlineOpts.push("showButtons: false");
    if (config.inlineAutoUpdate) inlineOpts.push("autoUpdate: true");
    options.push(`inline: {\n    ${inlineOpts.join(",\n    ")}\n  }`);
  }

  if (
    config.disabledHours ||
    config.disabledMinutes ||
    config.disabledInterval
  ) {
    const disabledOpts: string[] = [];
    if (config.disabledHours) {
      const hours = config.disabledHours.split(",").map((h) => h.trim());
      disabledOpts.push(`hours: [${hours.join(", ")}]`);
    }
    if (config.disabledMinutes) {
      const minutes = config.disabledMinutes.split(",").map((m) => m.trim());
      disabledOpts.push(`minutes: [${minutes.join(", ")}]`);
    }
    if (config.disabledInterval) {
      disabledOpts.push(`interval: '${config.disabledInterval}'`);
    }
    if (disabledOpts.length > 0) {
      options.push(`disabledTime: {\n    ${disabledOpts.join(",\n    ")}\n  }`);
    }
  }

  if (config.currentTimeEnabled) {
    options.push(
      `currentTime: {\n    updateInput: true,\n    time: new Date()\n  }`
    );
  }

  const optionsString =
    options.length > 0 ? `, {\n  ${options.join(",\n  ")}\n}` : "";

  return `const picker = new TimepickerUI(input${optionsString});
picker.create();`;
}

interface SelectFieldProps {
  label: string;
  value: string | number;
  options: SelectOption[] | NumberOption[];
  onChange: (value: string | number) => void;
}

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          const numVal = Number(val);
          onChange(isNaN(numVal) ? val : numVal);
        }}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface CheckboxFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function CheckboxField({
  label,
  description,
  checked,
  onChange,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-start justify-between py-2">
      <div className="flex-1">
        <label className="text-sm font-medium text-foreground block">
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 mt-0.5 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function InputField({ label, placeholder, value, onChange }: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

export default function PlaygroundPage() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  const updateConfig = (
    key: keyof Config,
    value: string | boolean | number
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Interactive Playground
        </h1>
        <p className="text-lg text-muted-foreground">
          Test different configurations and see the generated code in real-time
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Section icon={Settings} title="Basic Options">
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Clock Type"
                  value={config.clockType}
                  options={CLOCK_TYPES}
                  onChange={(value) => updateConfig("clockType", value)}
                />

                <SelectField
                  label="Theme"
                  value={config.theme}
                  options={THEMES}
                  onChange={(value) => updateConfig("theme", value)}
                />
              </div>

              <div className="space-y-1 pt-4 border-t border-border">
                {BASIC_CHECKBOXES.map((checkbox) => (
                  <CheckboxField
                    key={checkbox.key}
                    label={checkbox.label}
                    description={checkbox.description}
                    checked={config[checkbox.key] as boolean}
                    onChange={(checked) => updateConfig(checkbox.key, checked)}
                  />
                ))}
              </div>
            </div>
          </Section>

          <Section icon={Clock} title="Behavior">
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Increment Hours"
                  value={config.incrementHours}
                  options={INCREMENT_HOURS}
                  onChange={(value) => updateConfig("incrementHours", value)}
                />

                <SelectField
                  label="Increment Minutes"
                  value={config.incrementMinutes}
                  options={INCREMENT_MINUTES}
                  onChange={(value) => updateConfig("incrementMinutes", value)}
                />
              </div>

              <div className="space-y-1 pt-4 border-t border-border">
                {BEHAVIOR_CHECKBOXES.map((checkbox) => (
                  <CheckboxField
                    key={checkbox.key}
                    label={checkbox.label}
                    description={checkbox.description}
                    checked={config[checkbox.key] as boolean}
                    onChange={(checked) => updateConfig(checkbox.key, checked)}
                  />
                ))}
              </div>
            </div>
          </Section>

          <Section icon={Type} title="Custom Labels">
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {LABEL_INPUTS.map((input) => (
                  <InputField
                    key={input.key}
                    label={input.label}
                    placeholder={input.placeholder}
                    value={config[input.key] as string}
                    onChange={(value) => updateConfig(input.key, value)}
                  />
                ))}
              </div>
            </div>
          </Section>

          <Section icon={Layout} title="Inline Mode">
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="space-y-1">
                {INLINE_CHECKBOXES.map((checkbox) => (
                  <CheckboxField
                    key={checkbox.key}
                    label={checkbox.label}
                    description={checkbox.description}
                    checked={config[checkbox.key] as boolean}
                    onChange={(checked) => updateConfig(checkbox.key, checked)}
                  />
                ))}
              </div>
            </div>
          </Section>

          <Section icon={Lock} title="Disabled Time">
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="grid gap-4">
                {DISABLED_INPUTS.map((input) => (
                  <InputField
                    key={input.key}
                    label={input.label}
                    placeholder={input.placeholder}
                    value={config[input.key] as string}
                    onChange={(value) => updateConfig(input.key, value)}
                  />
                ))}
              </div>
            </div>
          </Section>

          <div className="rounded-xl border border-border bg-card p-6">
            <CheckboxField
              label="Set Current Time"
              description="Initialize picker with current time"
              checked={config.currentTimeEnabled}
              onChange={(checked) =>
                updateConfig("currentTimeEnabled", checked)
              }
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Generated Code
                </h3>
              </div>
              <CodeBlock code={generateCode(config)} language="typescript" />
            </div>

            <InfoBox title="Quick Install" variant="emerald" emoji="📦">
              <CodeBlock code="npm install timepicker-ui" language="bash" />
            </InfoBox>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <InfoBox title="Live Preview Coming Soon" variant="blue" emoji="🚀">
          The interactive live preview is in development. For now, use the
          generated code in your project to test the configuration.
        </InfoBox>
      </div>
    </div>
  );
}
