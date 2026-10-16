import { JsonLdBreadcrumb, JsonLdFaq, JsonLdTechArticle } from "@/components/json-ld";
import { PAGE_DESCRIPTION, PROBLEMS } from "./troubleshooting-data";

const PATHNAME = "/docs/guides/troubleshooting";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname={PATHNAME} />
      <JsonLdTechArticle
        pathname={PATHNAME}
        headline="Troubleshooting"
        description={PAGE_DESCRIPTION}
      />
      <JsonLdFaq
        questions={PROBLEMS.map((p) => ({ question: p.symptom, answer: p.faqAnswer }))}
      />
      {children}
    </>
  );
}
