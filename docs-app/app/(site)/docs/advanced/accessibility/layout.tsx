import { JsonLdBreadcrumb, JsonLdTechArticle, JsonLdFaq } from "@/components/json-ld";

const faqQuestions = [
  {
    question: "Is timepicker-ui accessible?",
    answer:
      "Yes. The modal uses a dialog role with aria-modal, controls expose ARIA roles and labels, disabled times get aria-disabled, and time changes are announced through an aria-live region.",
  },
  {
    question: "How do I operate the time picker with a keyboard?",
    answer:
      "Open with Enter, move with Tab, and use the arrow keys to adjust the focused hour, minute or clock value. Home and End jump to the min or max, A or P toggles AM/PM, and Esc closes the picker.",
  },
  {
    question: "Does timepicker-ui work with screen readers?",
    answer:
      "Yes. It is tested with NVDA, JAWS and VoiceOver, announces hour, minute and AM/PM changes through a polite live region, and lets you rename every control with the labels option.",
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/advanced/accessibility" />
      <JsonLdTechArticle
        pathname="/docs/advanced/accessibility"
        headline="Accessibility"
        description="Accessibility in timepicker-ui - full keyboard navigation, ARIA roles, focus trap and screen-reader support. Zero-dependency, framework-agnostic and SSR-safe."
      />
      <JsonLdFaq questions={faqQuestions} />
      {children}
    </>
  );
}
