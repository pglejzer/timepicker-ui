import { JsonLdBreadcrumb, JsonLdTechArticle, JsonLdFaq } from "@/components/json-ld";

const faqQuestions = [
  {
    question: "How do I customize timepicker-ui colors?",
    answer:
      "Override the --tp- CSS custom properties on the wrapper, such as --tp-primary, --tp-bg, --tp-text and --tp-border-radius. Every theme reads these variables.",
  },
  {
    question: "How do I create a custom theme?",
    answer:
      "Set ui.theme to 'custom' and define the --tp- variables under the .tp-ui-wrapper.custom selector in your CSS to control colors, radius and fonts.",
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/advanced/styling" />
      <JsonLdTechArticle
        pathname="/docs/advanced/styling"
        headline="Custom Styling"
        description="Customize timepicker-ui with CSS variables and the tp-ui class contract - colors, sizing and themes. Zero-dependency, framework-agnostic and SSR-safe."
      />
      <JsonLdFaq questions={faqQuestions} />
      {children}
    </>
  );
}
