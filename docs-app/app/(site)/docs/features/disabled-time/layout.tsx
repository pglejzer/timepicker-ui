import { JsonLdBreadcrumb, JsonLdFaq } from "@/components/json-ld";

const faqQuestions = [
  {
    question: "How does disabling times work in timepicker-ui?",
    answer:
      "Add a clock.disabledTime config to block specific hours, minutes, seconds or time ranges. Blocked values are dimmed and cannot be picked on the clock face or the wheel. Arrow keys skip them, and OK stays disabled while the shown time is blocked.",
  },
  {
    question: "How do I disable specific hours?",
    answer:
      "Pass an array of hours to clock.disabledTime.hours. With clock: { type: '24h', disabledTime: { hours: [0, 1, 2, 3, 4, 5, 6, 7, 8] } }, only hours 9 to 23 can be selected. In 12-hour mode, the default, the list takes values 1 to 12 and blocks each listed hour in both AM and PM.",
  },
  {
    question: "How do I limit which minutes can be selected?",
    answer:
      "List the minutes to block in clock.disabledTime.minutes, or set clock.incrementMinutes to a step like 15 so only 0, 15, 30 and 45 are offered.",
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/features/disabled-time" />
      <JsonLdFaq questions={faqQuestions} />
      {children}
    </>
  );
}
