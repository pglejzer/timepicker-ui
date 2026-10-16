import type { ReactNode } from "react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { ApiTable } from "@/components/api-table";
import { Tabs, type TabItem } from "@/components/tabs";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "Use with AI",
  description:
    "Connect the timepicker-ui MCP server to Claude Code, Cursor, VS Code or Claude Desktop so your assistant reads real options, events and themes from the library.",
  path: "/docs/guides/ai",
});

const MCP_SERVERS_JSON = `{
  "mcpServers": {
    "timepicker-ui": {
      "command": "npx",
      "args": ["-y", "timepicker-ui-mcp"]
    }
  }
}`;

const VSCODE_JSON = `{
  "servers": {
    "timepicker-ui": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "timepicker-ui-mcp"]
    }
  }
}`;

const INSTALL_TABS: TabItem[] = [
  {
    id: "claude-code",
    label: "Claude Code",
    content: (
      <div className={styles.client}>
        <CodeBlock
          filename="Terminal"
          code="claude mcp add timepicker-ui -- npx -y timepicker-ui-mcp"
          language="bash"
        />
        <p>
          By default, only you can use the server, and only in this project.
          Add <code>-s user</code> after <code>add</code> to use it in every
          project, or <code>-s project</code> to save it in{" "}
          <code>.mcp.json</code> and share it with your team.
        </p>
        <p>
          On native Windows, wrap <code>npx</code> in <code>cmd /c</code>:
        </p>
        <CodeBlock
          filename="Terminal"
          code="claude mcp add timepicker-ui -- cmd /c npx -y timepicker-ui-mcp"
          language="bash"
        />
      </div>
    ),
  },
  {
    id: "cursor",
    label: "Cursor",
    content: (
      <div className={styles.client}>
        <p>
          Cursor reads <code>.cursor/mcp.json</code> in your project, or{" "}
          <code>~/.cursor/mcp.json</code> for every project.
        </p>
        <CodeBlock filename=".cursor/mcp.json" code={MCP_SERVERS_JSON} language="json" />
      </div>
    ),
  },
  {
    id: "vscode",
    label: "VS Code",
    content: (
      <div className={styles.client}>
        <p>
          Add the server to <code>.vscode/mcp.json</code> in your project and
          start it from that file. VS Code uses the <code>servers</code> key,
          not <code>mcpServers</code>.
        </p>
        <CodeBlock filename=".vscode/mcp.json" code={VSCODE_JSON} language="json" />
      </div>
    ),
  },
  {
    id: "claude-desktop",
    label: "Claude Desktop",
    content: (
      <div className={styles.client}>
        <p>
          Settings → Developer → Edit Config opens{" "}
          <code>claude_desktop_config.json</code>, which is in{" "}
          <code>~/Library/Application Support/Claude/</code> on macOS and{" "}
          <code>{"%APPDATA%\\Claude\\"}</code> on Windows. Add the server under{" "}
          <code>mcpServers</code>:
        </p>
        <CodeBlock filename="claude_desktop_config.json" code={MCP_SERVERS_JSON} language="json" />
        <p>
          Save the file, then quit Claude Desktop completely and start it
          again. Its logs are in <code>~/Library/Logs/Claude</code> or{" "}
          <code>{"%APPDATA%\\Claude\\logs"}</code>.
        </p>
      </div>
    ),
  },
];

type ToolGroup = "Look up" | "Generate" | "Check";

type Tool = { name: string; group: ToolGroup; description: ReactNode };

const TOOLS: Tool[] = [
  {
    name: "search_reference",
    group: "Look up",
    description:
      "Keyword search across options (nested fields included), events, CSS variables, CSS classes, methods, themes and troubleshooting entries, for when the exact name is not known.",
  },
  { name: "list_themes", group: "Look up", description: "Built-in themes and their CSS import paths." },
  {
    name: "list_modes",
    group: "Look up",
    description: (
      <>
        UI modes (<code>clock</code>, <code>wheel</code>,{" "}
        <code>compact-wheel</code>) and the plugin each one needs.
      </>
    ),
  },
  {
    name: "list_plugins",
    group: "Look up",
    description: "Optional plugins (range, timezone, wheel) with their import paths.",
  },
  {
    name: "list_events",
    group: "Look up",
    description: (
      <>
        Events with their payload fields. Pass <code>includeInternal</code> or{" "}
        <code>includeDeprecated</code> to also get internal or deprecated
        events.
      </>
    ),
  },
  {
    name: "list_api",
    group: "Look up",
    description: (
      <>
        Instance and static methods, plus what <code>getValue()</code> returns
        and <code>setValue()</code> accepts. Deprecated methods are flagged.
      </>
    ),
  },
  {
    name: "list_css_classes",
    group: "Look up",
    description: (
      <>
        The <code>tp-ui-</code> class names and state modifiers, each with an
        example selector.
      </>
    ),
  },
  {
    name: "list_css_variables",
    group: "Look up",
    description: (
      <>
        The <code>--tp-</code> variables with their group and default value.{" "}
        <code>group</code> narrows the list. Variables that no rule reads are
        left out unless <code>includeUnread</code> is set.
      </>
    ),
  },
  {
    name: "get_options",
    group: "Look up",
    description: (
      <>
        Options with type, default and description. Pass <code>group</code>{" "}
        to get one group. Deprecated options appear only with{" "}
        <code>includeDeprecated</code>.
      </>
    ),
  },
  {
    name: "explain_option",
    group: "Look up",
    description: (
      <>
        Full detail for one option, by <code>group</code> and{" "}
        <code>name</code>. A dotted name such as{" "}
        <code>disabledTime.ranges</code> reaches nested fields.
      </>
    ),
  },
  {
    name: "get_theme",
    group: "Look up",
    description: (
      <>
        The <code>--tp-</code> variables a built-in theme sets, with their
        values.
      </>
    ),
  },
  {
    name: "framework_recipe",
    group: "Generate",
    description: (
      <>
        Setup code and server rendering notes for vanilla JS, React, Next.js,
        Vue, Angular or Svelte, plus the <code>react-wrapper</code> recipe for{" "}
        <code>timepicker-ui-react</code>.
      </>
    ),
  },
  {
    name: "generate_snippet",
    group: "Generate",
    description: (
      <>
        Vanilla JS or React setup code, with the CSS imports and plugin
        registration. Also covers the seconds field and{" "}
        <code>{"clockType: 'auto'"}</code>.
      </>
    ),
  },
  {
    name: "generate_custom_theme",
    group: "Generate",
    description: (
      <>
        Writes a <code>{".tp-ui-wrapper.<name>"}</code> block for a class you
        pass in <code>ui.cssClass</code>, from your <code>--tp-</code>{" "}
        overrides or as a scaffold to edit.
      </>
    ),
  },
  {
    name: "migration_guide",
    group: "Generate",
    description:
      "The v3 to v4 option mapping, the changes from 4.3 to 4.4 and from 4.4 to 4.5, and the draft 4.5 to 5.0 path with its renamed and removed tables.",
  },
  {
    name: "validate_time",
    group: "Check",
    description: (
      <>
        Checks <code>HH:MM</code>, <code>HH:MM:SS</code>,{" "}
        <code>h:MM AM/PM</code> or <code>h:MM:SS AM/PM</code> against a 12h
        or 24h clock.
      </>
    ),
  },
  {
    name: "validate_disabled_time",
    group: "Check",
    description: (
      <>
        Checks a <code>clock.disabledTime</code> config: the hour, minute and
        second lists and the range strings.
      </>
    ),
  },
];

export default function UseWithAiPage() {
  return (
    <div>
      <PageHeader
        title="Use with AI"
        description={
          <>
            The <code>timepicker-ui-mcp</code> server gives your AI assistant
            the library&apos;s options, events, themes and CSS classes, read
            from the source, so it does not have to guess them.
          </>
        }
      />

      <Section title="Install">
        <p>
          The server runs on your machine through <code>npx</code>. It needs
          Node 20 or newer and no API key. It works with MCP clients on the
          2025 protocol and on the 2026-07-28 revision. Its releases are listed
          in the <Link href="/docs/changelog/mcp">MCP server changelog</Link>.
        </p>
        <Tabs label="MCP client" items={INSTALL_TABS} />
      </Section>

      <Section title="What it can do">
        <p>
          The server has 17 tools. The assistant chooses which ones to call
          from your request.
        </p>
        <ApiTable
          columns={[
            { key: "tool", label: "Tool" },
            { key: "group", label: "Group" },
            { key: "description", label: "What it does" },
          ]}
          rows={TOOLS.map((tool) => ({
            id: tool.name,
            tool: <code>{tool.name}</code>,
            group: tool.group,
            description: tool.description,
          }))}
          rowKey="id"
        />
        <p>
          It also has four resources, which some clients let you attach to a
          chat as context: <code>timepicker-ui://reference</code> (a summary of
          the options), <code>timepicker-ui://css-variables</code> (every{" "}
          <code>--tp-</code> variable with its group, its default and whether
          any rule reads it), <code>timepicker-ui://custom-theme-guide</code>{" "}
          (a custom theme built on <code>ui.cssClass</code>) and{" "}
          <code>timepicker-ui://troubleshooting</code> (the same entries as the{" "}
          <Link href="/docs/guides/troubleshooting">troubleshooting page</Link>
          ).
        </p>
        <p>
          Four prompts start a task and tell the assistant which tools to
          use: <code>integrate</code> takes a framework,{" "}
          <code>build-custom-theme</code> a description of the look you want,
          and <code>migrate-v3-to-v4</code> your v3 code.{" "}
          <code>prepare-for-v5</code> takes your 4.x code and replaces
          deprecated API with the names 5.0 keeps.
        </p>
      </Section>

      <Section title="Example prompts">
        <p>Ask in your own words. Each prompt below matches one or two tools:</p>
        <ul>
          <li>
            &quot;Add a 24-hour timepicker with the dark theme to my Next.js
            page.&quot; Tools: <code>framework_recipe</code>,{" "}
            <code>generate_snippet</code>.
          </li>
          <li>
            &quot;Make a custom theme with #0f62fe as the primary color.&quot;
            Tool: <code>generate_custom_theme</code>.
          </li>
          <li>
            &quot;Migrate this v3 timepicker config to v4.&quot; Tool:{" "}
            <code>migration_guide</code>.
          </li>
          <li>
            &quot;Is this <code>disabledTime</code> config valid?&quot; Tool:{" "}
            <code>validate_disabled_time</code>.
          </li>
          <li>
            &quot;Which option blocks the lunch break?&quot; Tool:{" "}
            <code>search_reference</code>.
          </li>
        </ul>
      </Section>

      <Section title="Troubleshooting">
        <h3>The server does not start</h3>
        <p>
          Check that <code>node --version</code> prints 20 or newer. Then start
          the server in a terminal, where you can see its error:
        </p>
        <CodeBlock filename="Terminal" code="npx -y timepicker-ui-mcp" language="bash" />
        <p>
          If it starts, it prints{" "}
          <code>timepicker-ui MCP server running on stdio</code> and waits for
          a client. Stop it with Ctrl+C.
        </p>

        <h3>The tools do not show up</h3>
        <p>
          Quit the client completely and open it again. If the tools are still
          missing, connect to the server with the MCP Inspector. It lists the
          tools, resources and prompts the server offers, and you can call
          each tool from there:
        </p>
        <CodeBlock
          filename="Terminal"
          code="npx @modelcontextprotocol/inspector npx -y timepicker-ui-mcp"
          language="bash"
        />

        <h3>The assistant does not use the tools</h3>
        <p>
          The assistant decides when to call a tool, and it can still answer
          from memory. Name the server in your prompt, for example &quot;use
          the timepicker-ui MCP server&quot;.
        </p>
      </Section>

      <Section id="llms-txt" title="llms.txt">
        <p>
          The site also publishes <a href="/llms.txt">/llms.txt</a>, a
          plain-text index of these docs for AI tools: a short summary of the
          library and a link to each page in the navigation. Give its URL to an
          assistant that cannot connect to an MCP server.
        </p>
      </Section>
    </div>
  );
}
