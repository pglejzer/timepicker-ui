import {
  JsonLdBreadcrumb,
  JsonLdFaq,
  JsonLdTechArticle,
} from "@/components/json-ld";

const faqQuestions = [
  {
    question: "Will my v3.x code break?",
    answer:
      "Yes. v4.0.0 is a major breaking change. You MUST update all code to use grouped options.",
  },
  {
    question: "Is there a migration layer?",
    answer:
      "No. There is NO backward compatibility. All old flat structure code will break.",
  },
  {
    question: "Can I mix flat and grouped structures?",
    answer: "No. Only grouped structure is supported in v4.0.0.",
  },
  {
    question: "How long will migration take?",
    answer:
      "Depending on your codebase size, it should take 15-60 minutes using find-and-replace.",
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/migration-guide" />
      <JsonLdTechArticle
        pathname="/docs/migration-guide"
        headline="Migration Guide v3 to v4"
        description="Upgrade timepicker-ui from v3.x to v4.0.0 - the new grouped options structure, renamed APIs and breaking changes explained step by step, with code examples."
      />
      <JsonLdFaq questions={faqQuestions} />
      {children}
    </>
  );
}
