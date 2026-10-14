import { JsonLdBreadcrumb, JsonLdFaq } from "@/components/json-ld";

const faqQuestions = [
  {
    question: "How does timepicker-ui handle mobile devices?",
    answer:
      "By default the picker opens as a 328px card centered in the viewport, 315px wide on portrait screens 330px wide or less. On landscape screens up to 480px tall the clock view switches to a 584 by 360px horizontal layout. Touch works on the clock face (tap a number or drag the hand) and on the wheel columns (drag).",
  },
  {
    question: "What touch gestures does the mobile picker support?",
    answer:
      "Tap a number to select it, drag the clock hand to fine-tune, tap the hour or minute display to switch between them, and tap AM or PM in 12-hour mode.",
  },
  {
    question: "How do I enable the mobile view?",
    answer:
      "Set ui.initialView to 'keyboard'. The picker then opens in the keyboard input view, with hour and minute fields you type into instead of the clock face. Add ui.viewSwitch: true to show a button that switches between this view and the clock face. The view is not chosen by screen size: without ui.initialView, phones get the same clock or wheel view as desktops.",
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
