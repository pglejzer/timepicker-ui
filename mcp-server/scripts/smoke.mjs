import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const failures = [];

let era = '';

function check(label, condition) {
  if (condition) {
    console.log(`  ok  ${label}`);
  } else {
    console.error(`FAIL  [${era}] ${label}`);
    failures.push(`[${era}] ${label}`);
  }
}

function callText(result) {
  return result.content?.map((c) => c.text).join('\n') ?? '';
}

let client;

async function callJson(name, args = {}) {
  const result = await client.callTool({ name, arguments: args });
  return { result, data: JSON.parse(result.content[0].text) };
}

const expectedTools = [
  'list_themes',
  'list_modes',
  'list_plugins',
  'list_events',
  'list_api',
  'list_css_classes',
  'list_css_variables',
  'get_options',
  'explain_option',
  'get_theme',
  'framework_recipe',
  'migration_guide',
  'generate_snippet',
  'generate_custom_theme',
  'validate_time',
  'validate_disabled_time',
  'search_reference',
];

async function runSuite(label, clientOptions) {
  era = label;
  console.log(`\n== ${label}`);
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [resolve(root, 'build', 'index.js')],
  });
  client = new Client({ name: 'smoke', version: '1.0.0' }, clientOptions);
  await client.connect(transport);
  check(`negotiated ${client.getNegotiatedProtocolVersion()}`, !!client.getNegotiatedProtocolVersion());

  console.log('Discovery:');
  const server = client.getServerVersion();
  check(`server version ${pkg.version}`, server?.version === pkg.version);
  check('server instructions', (client.getInstructions() ?? '').includes('search_reference'));

  const tools = (await client.listTools()).tools;
  for (const name of expectedTools) check(`tool ${name}`, tools.some((t) => t.name === name));
  check('every tool is read-only', tools.every((t) => t.annotations?.readOnlyHint === true));
  check(
    'validate_disabled_time hours schema is not empty',
    JSON.stringify(tools.find((t) => t.name === 'validate_disabled_time')?.inputSchema?.properties?.hours ?? {}).length > 20,
  );

  const resources = (await client.listResources()).resources.map((r) => r.uri);
  const prompts = (await client.listPrompts()).prompts.map((p) => p.name);
  check('4 resources', resources.length === 4);
  check('4 prompts', prompts.length === 4);

  console.log('Calls:');
  const events = (await callJson('list_events')).data;
  check('list_events has fields', events.events.find((e) => e.name === 'confirm')?.fields?.length > 0);
  check('list_events hides internal and deprecated', !events.events.some((e) => e.internal || e.deprecated));
  check('list_events reports omitted', events.omitted.includes('select:am') && events.omitted.includes('open:request'));

  const recipe = (await callJson('framework_recipe', { framework: 'next' })).data;
  check('next recipe has use client and tp-ui wrapper', recipe.code.includes("'use client'") && recipe.code.includes('tp-ui'));
  check('react-wrapper recipe', (await callJson('framework_recipe', { framework: 'react-wrapper' })).data.code.includes('timepicker-ui-react'));

  const opt = (await callJson('explain_option', { group: 'clock', name: 'smoothHourSnap' })).data;
  check('explain_option flags deprecated', opt.name === 'smoothHourSnap' && /discreteHourJump/.test(opt.deprecated ?? ''));
  const nested = (await callJson('explain_option', { group: 'clock', name: 'disabledTime.ranges' })).data;
  check('explain_option resolves nested field', nested.name === 'ranges');
  const unknown = await callJson('explain_option', { group: 'clock', name: 'theme' });
  check('explain_option unknown is isError with didYouMean', unknown.result.isError === true && unknown.data.didYouMean?.includes('ui.theme'));

  const options = (await callJson('get_options', { group: 'clock' })).data;
  check(
    'get_options hides deprecated by default',
    !options.groups.clock.options.some((o) => o.name === 'smoothHourSnap') && options.omittedDeprecated.includes('clock.smoothHourSnap'),
  );

  const vars = (await callJson('list_css_variables', { group: 'Focus' })).data;
  check('list_css_variables knows --tp-focus-ring', vars.variables.some((v) => v.name === '--tp-focus-ring'));

  const theme = (await callJson('get_theme', { name: 'dark' })).data;
  check('get_theme returns vars', Array.isArray(theme.variables) && theme.variables.length > 0);

  const custom = callText(
    await client.callTool({
      name: 'generate_custom_theme',
      arguments: { name: 'ocean', overrides: { 'tp-primary': '#0ea5e9', '--tp-focus-ring': '#000', 'tp-hover-bg': '#111' } },
    }),
  );
  check('custom theme targets .tp-ui-wrapper.ocean', custom.includes('.tp-ui-wrapper.ocean {') && custom.includes("cssClass: 'ocean'"));
  check('custom theme accepts --tp-focus-ring', custom.includes('--tp-focus-ring: #000;') && !custom.includes('--tp-focus-ring is not'));
  check('custom theme drops unread variables', !custom.includes('--tp-hover-bg: #111') && custom.includes('--tp-hover-bg has no effect'));
  const badTheme = await client.callTool({ name: 'generate_custom_theme', arguments: { name: 'my theme' } });
  check('custom theme rejects an invalid class name', badTheme.isError === true);

  const snippet = callText(
    await client.callTool({ name: 'generate_snippet', arguments: { framework: 'react', mode: 'wheel', showSeconds: true } }),
  );
  check('snippet registers WheelPlugin and shows seconds', snippet.includes('PluginRegistry.register(WheelPlugin)') && snippet.includes('showSeconds: true'));

  const mig = (await callJson('migration_guide', { path: 'v3->v4' })).data;
  check('migration v3->v4 has mappings', mig.mappings?.length === 5);
  const v5 = (await callJson('migration_guide', { path: 'v4.5->v5' })).data;
  check('migration v4.5->v5 has renamed and removed', v5.renamed?.length > 0 && v5.removed?.length > 0);

  const search = (await callJson('search_reference', { query: 'focus ring' })).data;
  check('search finds --tp-focus-ring', search.results.some((r) => r.name === '--tp-focus-ring'));
  const searchSeconds = (await callJson('search_reference', { query: 'showSeconds' })).data;
  check('search ranks clock.showSeconds first', searchSeconds.results[0]?.name === 'clock.showSeconds');

  const time = (await callJson('validate_time', { time: '2:30:15 PM', clockType: '12h' })).data;
  check('validate_time parses seconds', time.valid === true && time.normalized === '14:30:15');

  const dt = (
    await callJson('validate_disabled_time', { interval: 'bad interval', minutes: [99], clockType: '24h' })
  ).data;
  check('validate_disabled_time flags issues', dt.valid === false && dt.issues.length >= 2 && dt.notes?.length === 1);
  const goodDt = (
    await callJson('validate_disabled_time', { ranges: '10:00 AM - 12:00 PM', clockType: '12h', hours: [3, '5'] })
  ).data;
  check('validate_disabled_time accepts valid', goodDt.valid === true);

  console.log('Resources and prompts:');
  for (const uri of resources) {
    const body = (await client.readResource({ uri })).contents[0]?.text ?? '';
    check(`resource ${uri} has content`, body.length > 200);
  }
  const guide = (await client.readResource({ uri: 'timepicker-ui://custom-theme-guide' })).contents[0].text;
  check('custom theme guide uses ui.cssClass', guide.includes('ui.cssClass') && !guide.includes('as any'));
  const prompt = await client.getPrompt({ name: 'integrate', arguments: { framework: 'vue' } });
  check('integrate prompt renders', prompt.messages[0]?.content?.text?.includes('vue'));
  const completion = await client.complete({
    ref: { type: 'ref/prompt', name: 'integrate' },
    argument: { name: 'framework', value: 're' },
  });
  check('integrate framework completes', completion.completion.values.includes('react'));

  await client.close();
}

await runSuite('2025 client (initialize)', {});
await runSuite('2026-07-28 client', { versionNegotiation: { mode: { pin: '2026-07-28' } } });

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll smoke checks passed.');
