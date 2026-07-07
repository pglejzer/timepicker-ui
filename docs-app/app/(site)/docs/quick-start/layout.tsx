import { JsonLdBreadcrumb, JsonLdTechArticle, JsonLdFaq } from "@/components/json-ld";

const faqQuestions = [
  {
    question: "How do I create a time picker?",
    answer:
      "Add an input element, then call new TimepickerUI(input) and picker.create(). That renders a clock time picker with the default options.",
  },
  {
    question: "How do I configure the picker?",
    answer:
      "Pass a grouped options object, for example { ui: { theme: 'dark' }, clock: { type: '24h' } }. Options are grouped under ui, clock, labels, behavior and callbacks.",
  },
  {
    question: "How do I use timepicker-ui in React, Vue or Angular?",
    answer:
      "Create the instance in an effect or lifecycle hook such as useEffect, onMounted or ngAfterViewInit after the input mounts, and call picker.destroy() on cleanup to avoid memory leaks.",
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/quick-start" />
      <JsonLdTechArticle
        pathname="/docs/quick-start"
        headline="Quick Start"
        description="Quick start guide for timepicker-ui - render your first analog clock time picker in minutes. Zero-dependency, framework-agnostic, SSR-safe and fully typed."
      />
      <JsonLdFaq questions={faqQuestions} />
      {children}
    </>
  );
}
