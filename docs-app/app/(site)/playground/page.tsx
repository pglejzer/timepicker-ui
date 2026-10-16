import { PageHeader } from "@/components/page-header";
import { Playground } from "@/components/playground/playground";
import styles from "@/components/playground/playground.module.css";

export default function PlaygroundPage() {
  return (
    <main id="main-content" className={styles.page}>
      <PageHeader
        title="Playground"
        description="Every change to the settings updates the preview and the generated code."
      />
      <Playground />
    </main>
  );
}
