const normalize = (text: string): string => text.replace(/\s+/g, ' ').trim();

const exposedText = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (!(node instanceof Element)) return '';
  if (node.getAttribute('aria-hidden') === 'true') return '';
  return Array.from(node.childNodes).map(exposedText).join(' ');
};

const accessibleName = (element: Element): string => {
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    return normalize(
      labelledBy
        .split(/\s+/)
        .map((id) => {
          const referenced = document.getElementById(id);
          return referenced ? exposedText(referenced) : '';
        })
        .join(' '),
    );
  }

  const label = element.getAttribute('aria-label');
  if (label !== null && label.trim() !== '') return normalize(label);

  return normalize(exposedText(element));
};

export { accessibleName };
