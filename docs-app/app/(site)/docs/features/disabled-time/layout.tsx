import { JsonLdBreadcrumb, JsonLdFaq } from "@/components/json-ld";

const faqQuestions = [
  {
    question: "How does disabling times work in timepicker-ui?",
    answer:
      "Add a clock.disabledTime config to block specific hours, minutes or intervals. Blocked values are dimmed, cannot be selected, and are skipped during keyboard navigation.",
  },
  {
    question: "How do I disable specific hours?",
    answer:
      "Pass an array of hours to clock.disabledTime.hours. For example, clock: { disabledTime: { hours: [0, 1, 2, 3, 4, 5, 6, 7, 8] } } leaves only 9 to 23 selectable.",
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
