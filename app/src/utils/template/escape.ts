const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const escapeHtml = (value: string | undefined): string =>
  String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
