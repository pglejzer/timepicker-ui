import { JsonLdBreadcrumb, JsonLdTechArticle, JsonLdFaq } from "@/components/json-ld";

const faqQuestions = [
  {
    question: "How do I install timepicker-ui?",
    answer:
      "Install it from npm with npm install timepicker-ui, or the yarn and pnpm equivalents. It has zero runtime dependencies, so nothing else is pulled in.",
  },
  {
    question: "How do I import the timepicker-ui styles?",
    answer:
      "Import the library CSS once in your entry file from timepicker-ui/main.css, then add a theme file on top if you want a non-default look.",
  },
  {
    question: "Can I use timepicker-ui from a CDN?",
    answer:
      "Yes. Link dist/css/main.css and the UMD bundle from jsDelivr, then use the global TimepickerUI class for quick prototypes.",
  },
];

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/installation" />
      <JsonLdTechArticle
        pathname="/docs/installation"
        headline="Installation"
        description="Install timepicker-ui via npm, yarn, pnpm or CDN. Zero-dependency, framework-agnostic and SSR-safe - works in React, Vue, Angular, Svelte and vanilla JS."
      />
      <JsonLdFaq questions={faqQuestions} />
      {children}
    </>
  );
}
