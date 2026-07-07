import { JsonLdBreadcrumb, JsonLdFaq } from "@/components/json-ld";

const faqQuestions = [
  {
    question: "How does timepicker-ui handle mobile devices?",
    answer:
      "The clock face scales to the screen, controls use touch-friendly hit targets, and drag gestures let you set the time. On small screens the picker opens as a full-screen modal.",
  },
  {
    question: "What touch gestures does the mobile picker support?",
    answer:
      "Tap a number to select it, drag the clock hand to fine-tune, tap the hour or minute display to switch between them, and tap AM or PM in 12-hour mode.",
  },
  {
    question: "How do I enable the mobile view?",
    answer:
      "Set ui.mobile to true to force the touch-optimized view, or leave it off to let the picker adapt to the screen size automatically.",
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/features/mobile" />
      <JsonLdFaq questions={faqQuestions} />
      {children}
    </>
  );
}
