import { JsonLdBreadcrumb, JsonLdFaq } from "@/components/json-ld";

const faqQuestions = [
  {
    question: "How does timepicker-ui validate time input?",
    answer:
      "It checks the value against the selected 12-hour (hh:mm AM/PM) or 24-hour (HH:mm) format, keeps hours and minutes in range, and respects your clock.disabledTime rules so blocked times cannot be chosen.",
  },
  {
    question: "How do I react to a confirmed time?",
    answer:
      "Handle the confirmed selection through the picker confirm callback or events, then read the final value with picker.getValue().",
  },
  {
    question: "Can I add my own validation rules?",
    answer:
      "Yes. Apply custom checks such as a minimum time or an allowed range to the confirmed value, and repeat the same validation on your server.",
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/features/validation" />
      <JsonLdFaq questions={faqQuestions} />
      {children}
    </>
  );
}
