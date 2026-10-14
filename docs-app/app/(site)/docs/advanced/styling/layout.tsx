import { JsonLdBreadcrumb, JsonLdTechArticle, JsonLdFaq } from "@/components/json-ld";

const faqQuestions = [
  {
    question: "How do I customize timepicker-ui colors?",
    answer:
      "Set the --tp- CSS custom properties, such as --tp-primary, --tp-bg, --tp-text and --tp-border-radius, on .tp-ui-wrapper for every picker, or on .tp-ui-wrapper.my-theme with ui: { cssClass: 'my-theme' } for one picker. The built-in themes set the same variables on the modal, so values on the wrapper override them.",
  },
  {
    question: "How do I change the font?",
    answer:
      "Set --tp-font-family. .tp-ui-wrapper reads it with font-family: var(--tp-font-family, 'Roboto', sans-serif), and the time fields and buttons in the modal inherit it. Set it on :root or .tp-ui-modal for every picker, or on the class you pass in ui.cssClass for one picker.",
  },
  {
    question: "How do I create a custom theme?",
    answer:
      "Pass a class name in ui.cssClass, for example 'my-theme', and set the --tp- variables under the .tp-ui-wrapper.my-theme selector in your CSS. The picker adds the class to its wrapper when it opens. ui.theme accepts only the 12 built-in theme names.",
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
