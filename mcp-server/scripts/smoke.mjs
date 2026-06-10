import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function check(label, condition) {
  if (condition) {
    console.log(`  ok  ${label}`);
  } else {
    console.error(`FAIL  ${label}`);
    failures.push(label);
  }
}

function callText(result) {
  return result.content?.map((c) => c.text).join('') ?? '';
}

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [resolve(root, 'build', 'index.js')],
});
const client = new Client({ name: 'smoke', version: '1.0.0' });
await client.connect(transport);

const tools = (await client.listTools()).tools.map((t) => t.name);
const resources = (await client.listResources()).resources.map((r) => r.uri);
const prompts = (await client.listPrompts()).prompts.map((p) => p.name);

const expectedTools = [
  'list_themes',
  'list_modes',
  'list_plugins',
  'list_events',
  'list_api',
  'list_css_classes',
  'get_options',
  'explain_option',
  'get_theme',
  'framework_recipe',
  'migration_guide',
  'generate_snippet',
  'generate_custom_theme',
  'validate_time',
  'validate_disabled_time',
];

console.log('Discovery:');
for (const t of expectedTools) check(`tool ${t}`, tools.includes(t));
check('4 resources', resources.length === 4);
check('3 prompts', prompts.length === 3);

console.log('Calls:');
const events = JSON.parse(callText(await client.callTool({ name: 'list_events', arguments: {} })));
check('list_events has fields', events.find((e) => e.name === 'confirm')?.fields?.length > 0);

const recipe = callText(await client.callTool({ name: 'framework_recipe', arguments: { framework: 'next' } }));
check('next recipe mentions use client', recipe.includes("'use client'"));

const opt = JSON.parse(
  callText(await client.callTool({ name: 'explain_option', arguments: { group: 'clock', name: 'smoothHourSnap' } })),
);
check('explain_option resolves', opt.name === 'smoothHourSnap' && !!opt.default);

const theme = JSON.parse(callText(await client.callTool({ name: 'get_theme', arguments: { name: 'dark' } })));
check('get_theme returns vars', Array.isArray(theme.variables) && theme.variables.length > 0);

const mig = JSON.parse(callText(await client.callTool({ name: 'migration_guide', arguments: { path: 'v3->v4' } })));
check('migration has mappings', mig.mappings?.length === 5);

const dt = JSON.parse(
  callText(
    await client.callTool({
      name: 'validate_disabled_time',
      arguments: { interval: 'bad interval', minutes: [99], clockType: '24h' },
    }),
  ),
);
check('validate_disabled_time flags issues', dt.valid === false && dt.issues.length >= 2);

const goodDt = JSON.parse(
  callText(
    await client.callTool({
      name: 'validate_disabled_time',
      arguments: { interval: '10:00 AM - 12:00 PM', clockType: '12h', hours: [3, '5'] },
    }),
  ),
);
check('validate_disabled_time accepts valid', goodDt.valid === true);

await client.close();

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll smoke checks passed.');
