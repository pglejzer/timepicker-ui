import { JsonLdBreadcrumb, JsonLdFaq } from "@/components/json-ld";

const faqQuestions = [
  {
    question: "What is inline mode?",
    answer:
      "Inline mode renders the clock straight into the page with no modal or backdrop, so the picker is always visible. It suits dashboards, settings panels and embedded forms.",
  },
  {
    question: "How do I enable inline mode?",
    answer:
      "Set ui.inline to { enabled: true, containerId: 'your-container-id' }. The picker then renders inside that container instead of opening as a modal.",
  },
  {
    question: "Can I combine inline mode with themes and 24-hour format?",
    answer:
      "Yes. Inline mode works with every theme, 12h/24h format and disabled-time rules - set them alongside ui.inline in the same options object.",
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/features/inline-mode" />
      <JsonLdFaq questions={faqQuestions} />
      {children}
    </>
  );
}
