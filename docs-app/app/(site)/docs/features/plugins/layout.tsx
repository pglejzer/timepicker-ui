import { JsonLdBreadcrumb, JsonLdFaq } from "@/components/json-ld";

const faqQuestions = [
  {
    question: "How do plugins work in timepicker-ui?",
    answer:
      "Plugins are optional, tree-shakeable features. Import the ones you need, register them once with PluginRegistry.register(), then turn them on through options. Unused plugins stay out of your bundle.",
  },
  {
    question: "How do I add a time range picker?",
    answer:
      "Import RangePlugin from timepicker-ui/plugins/range, register it, then set range: { enabled: true } with optional minDuration and maxDuration for from-to selection.",
  },
  {
    question: "How do I add a timezone selector?",
    answer:
      "Import TimezonePlugin from timepicker-ui/plugins/timezone, register it, then set timezone: { enabled: true } with a default and whitelist. The selector is display-only and does not convert times.",
  },
  {
    question: "How do I use the scroll wheel picker?",
    answer:
      "Import WheelPlugin from timepicker-ui/plugins/wheel, register it, then set ui.mode to 'wheel' for the full spinner or 'compact-wheel' for a headerless popover.",
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/features/plugins" />
      <JsonLdFaq questions={faqQuestions} />
      {children}
    </>
  );
}
