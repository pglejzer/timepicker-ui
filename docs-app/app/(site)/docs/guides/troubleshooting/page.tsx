import type { ReactNode } from "react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { buildMetadata } from "@/lib/metadata";
import {
  INLINE_TOKEN,
  LINK_TOKEN,
  PAGE_DESCRIPTION,
  PROBLEM_GROUPS,
  PROBLEMS,
  type FixStep,
  type Problem,
} from "./troubleshooting-data";

export const metadata = buildMetadata({
  title: "Troubleshooting",
  description: PAGE_DESCRIPTION,
  path: "/docs/guides/troubleshooting",
});

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE_TOKEN).map((part, index) => {
    if (index % 2 === 0) return part;

    const link = LINK_TOKEN.exec(part);
    if (!link) return <code key={index}>{part.slice(1, -1)}</code>;

    const [, label, href] = link;
    if (href.startsWith("#")) {
      return (
        <a key={index} href={href}>
          {renderInline(label)}
        </a>
      );
    }

    return (
      <Link key={index} href={href}>
        {renderInline(label)}
      </Link>
    );
  });
}

function StepCode({ step }: { step: FixStep }) {
  if (!step.code) return null;
  return <CodeBlock code={step.code.source} language={step.code.language} />;
}

function Fix({ steps }: { steps: FixStep[] }) {
  if (steps.length === 1) {
    const [step] = steps;
    return (
      <>
        <p>
          <strong>Fix:</strong> {renderInline(step.text)}
        </p>
        <StepCode step={step} />
      </>
    );
  }

  return (
    <>
      <p>
        <strong>Fix:</strong>
      </p>
      <ol>
        {steps.map((step) => (
          <li key={step.text}>
            {renderInline(step.text)}
            <StepCode step={step} />
          </li>
        ))}
      </ol>
    </>
  );
}

function ProblemEntry({ problem }: { problem: Problem }) {
  return (
    <>
      <h3 id={problem.anchor}>{renderInline(problem.title)}</h3>
      <Fix steps={problem.fix} />
      {problem.why && (
        <p>
          <strong>Why:</strong> {renderInline(problem.why)}
        </p>
      )}
    </>
  );
}

export default function TroubleshootingPage() {
  return (
    <div>
      <PageHeader
        title="Troubleshooting"
        description="Find the symptom you see, then apply the fix."
      />

      {PROBLEM_GROUPS.map((group) => (
        <Section key={group} title={group}>
          {PROBLEMS.filter((problem) => problem.group === group).map((problem) => (
            <ProblemEntry key={problem.anchor} problem={problem} />
          ))}
        </Section>
      ))}
    </div>
  );
}
