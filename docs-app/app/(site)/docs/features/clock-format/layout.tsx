import { JsonLdBreadcrumb, JsonLdFaq } from "@/components/json-ld";

const faqQuestions = [
  {
    question: "How do I use 12-hour (AM/PM) format?",
    answer:
      "12-hour format is the default. It shows hours 1 to 12 with AM and PM buttons, and getValue().time returns a string such as 10:30 AM. Set clock.type to '12h' to be explicit.",
  },
  {
    question: "How do I switch to 24-hour format?",
    answer:
      "Pass clock: { type: '24h' } to the constructor. Hours then run 0 to 23 with no AM/PM, and getValue().time returns a string such as 14:30.",
  },
  {
    question: "Can I change the clock format at runtime?",
    answer:
      "Yes. Call picker.update({ options: { clock: { type: '24h' } }, create: true }) to switch format after the picker is created.",
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/features/clock-format" />
      <JsonLdFaq questions={faqQuestions} />
      {children}
    </>
  );
}
