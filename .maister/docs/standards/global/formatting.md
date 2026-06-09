# Formatting

Formatting is machine-enforced via Prettier + EditorConfig; do not fight the formatter.

### CRLF Line Endings (Windows)
All source and edited files use CRLF (`\r\n`) line endings. Enforced three ways: ESLint `linebreak-style: ['error', 'windows']` (src/**/*.ts), `.editorconfig` `end_of_line = crlf`, Prettier `endOfLine: crlf`. Keep `.claude/` files CRLF too. Sources: config, docs.

### Single Quotes, Semicolons, Trailing Commas
Prettier-enforced: single quotes for strings, semicolons required, trailing commas everywhere (`trailingComma: all`), bracket spacing in object literals (`{ foo }`). Source: config (.prettierrc).

### Print Width 110, Prettier as Sole Formatter
Max line width 110 chars (Prettier wraps). ESLint `max-len` and `indent` rules are `off` so Prettier/EditorConfig are the single source of truth for layout. Source: config.

### Indentation & File Hygiene
2-space indentation (no tabs), UTF-8 charset, final newline required, trailing whitespace trimmed. Source: .editorconfig.
