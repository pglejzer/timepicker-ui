import { API_METHODS, DOCS, THEMES, optionGroupDocs } from './data.js';
import { CSS_CLASSES, CSS_VARS, EVENTS, OPTION_GROUPS, TROUBLESHOOTING, type OptionEntry } from './generated.js';

export interface SearchHit {
  kind: 'option' | 'event' | 'css-variable' | 'css-class' | 'method' | 'theme' | 'troubleshooting';
  name: string;
  summary: string;
  deprecated?: string;
  docs: string;
}

interface Candidate extends SearchHit {
  text: string;
}

function firstLine(text: string | undefined): string {
  return (text ?? '').split('\n')[0].trim();
}

function optionCandidates(): Candidate[] {
  const out: Candidate[] = [];
  const visit = (group: string, path: string, option: OptionEntry) => {
    const name = `${path}.${option.name}`;
    out.push({
      kind: 'option',
      name,
      summary: [option.type, firstLine(option.description)].filter(Boolean).join(' - '),
      deprecated: option.deprecated,
      docs: optionGroupDocs(group),
      text: `${option.description ?? ''} ${option.type}`,
    });
    for (const field of option.fields ?? []) visit(group, name, field);
  };
  for (const [group, data] of Object.entries(OPTION_GROUPS)) {
    for (const option of data.options) visit(group, group, option);
  }
  return out;
}

function candidates(): Candidate[] {
  return [
    ...optionCandidates(),
    ...EVENTS.filter((e) => !e.internal).map<Candidate>((e) => ({
      kind: 'event',
      name: e.name,
      summary: `payload ${e.data}: ${e.fields.map((f) => f.name).join(', ') || 'none'}`,
      deprecated: e.deprecated,
      docs: DOCS.events,
      text: `${e.description ?? ''} ${e.fields.map((f) => `${f.name} ${f.description ?? ''}`).join(' ')}`,
    })),
    ...CSS_VARS.map<Candidate>((v) => ({
      kind: 'css-variable',
      name: v.name,
      summary: `${v.group}, default ${v.default ?? 'unset'}${v.read ? '' : ', no rule reads it'}`,
      deprecated: v.read ? undefined : 'No rule reads it, so setting it changes nothing. Removed in 5.0.',
      docs: DOCS.cssVariables,
      text: v.group,
    })),
    ...CSS_CLASSES.classes.map<Candidate>((c) => ({
      kind: 'css-class',
      name: c.name,
      summary: c.example ? `e.g. ${c.example}` : 'rendered by the templates',
      docs: DOCS.cssClasses,
      text: '',
    })),
    ...API_METHODS.map<Candidate>((m) => ({
      kind: 'method',
      name: m.signature,
      summary: m.description,
      deprecated: m.deprecated,
      docs: DOCS.methods,
      text: m.description,
    })),
    ...THEMES.map<Candidate>((t) => ({
      kind: 'theme',
      name: t.name,
      summary: `import '${t.cssImport}'`,
      docs: DOCS.themes,
      text: t.note ?? '',
    })),
    ...TROUBLESHOOTING.map<Candidate>((t) => ({
      kind: 'troubleshooting',
      name: t.symptom,
      summary: t.fix.map((step) => step.text).join(' '),
      docs: t.docs,
      text: `${t.group} ${t.why ?? ''} ${t.fix.map((step) => step.text).join(' ')}`,
    })),
  ];
}

let index: Candidate[] | undefined;

export function searchReference(query: string, limit: number): SearchHit[] {
  const tokens = query
    .toLowerCase()
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
  if (tokens.length === 0) return [];

  index ??= candidates();
  const scored = index
    .map((item) => {
      const name = item.name.toLowerCase();
      const text = `${item.summary} ${item.text}`.toLowerCase();
      let score = 0;
      let matched = 0;
      for (const token of tokens) {
        let tokenScore = 0;
        if (name === token || name.endsWith(`.${token}`)) tokenScore = 8;
        else if (name.includes(token)) tokenScore = 4;
        else if (text.includes(token)) tokenScore = 1;
        if (tokenScore > 0) matched += 1;
        score += tokenScore;
      }
      if (matched === tokens.length) score *= 2;
      if (item.deprecated) score /= 2;
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.length - b.item.name.length);

  return scored.slice(0, limit).map(({ item }) => {
    const { text: _text, ...hit } = item;
    return hit;
  });
}
