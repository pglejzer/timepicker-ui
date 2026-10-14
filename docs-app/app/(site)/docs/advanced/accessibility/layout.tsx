import { JsonLdBreadcrumb, JsonLdTechArticle, JsonLdFaq } from "@/components/json-ld";

const faqQuestions = [
  {
    question: "Is timepicker-ui accessible?",
    answer:
      "Yes. The modal uses a dialog role with aria-modal and controls expose ARIA roles and labels. Disabled wheel items get aria-disabled, and so do the OK and Clear buttons when they can't be used. On the clock face, disabled numbers are dimmed and skipped by the keyboard. Time changes are announced through an aria-live region.",
  },
  {
    question: "How do I operate the time picker with a keyboard?",
    answer:
      "Open with Enter and move with Tab. The arrow keys change the focused hour, minute or second field, or the clock face, one step at a time. Home and End jump to the first or last value, and PageUp and PageDown take bigger steps. AM and PM are buttons you press with Enter or Space. Esc closes the picker unless it is inline.",
  },
  {
    question: "Does timepicker-ui work with screen readers?",
    answer:
      "Yes. It is built for screen readers such as NVDA, JAWS and VoiceOver, announces hour, minute and AM/PM changes through a polite live region, and lets you rename every control with the labels option.",
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
