import { TimepickerUI, PluginRegistry } from '../../src/index';
import { RangePlugin } from '../../src/plugins/range';
import { TimezonePlugin } from '../../src/plugins/timezone';
import { WheelPlugin } from '../../src/plugins/wheel';
import { codeToHtml } from 'shiki';

PluginRegistry.register(RangePlugin);
PluginRegistry.register(TimezonePlugin);
PluginRegistry.register(WheelPlugin);

export { TimepickerUI };

console.log(
  `%c
████████╗██╗███╗   ███╗███████╗██████╗ ██╗ ██████╗███████╗██████╗ 
╚══██╔══╝██║████╗ ████║██╔════╝██╔══██╗██║██╔════╝██╔════╝██╔══██╗
   ██║   ██║██╔████╔██║█████╗  ██████╔╝██║██║     █████╗  ██████╔╝
   ██║   ██║██║╚██╔╝██║██╔══╝  ██╔═══╝ ██║██║     ██╔══╝  ██╔══██╗
   ██║   ██║██║ ╚═╝ ██║███████╗██║     ██║╚██████╗███████╗██║  ██║
   ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝╚══════╝╚═╝  ╚═╝
                    T I M E P I C K E R - U I                  

✨ Because native <input type="time"> is illegal.
🤫 Shh... it just wraps <input>. But damn it looks good.
👉 github.com/pglejzer/timepicker-ui
`,
  'color: #00BCD4; font-weight: bold; font-family: monospace; font-size: 11px;',
);

const codeBlocks = document.querySelectorAll<HTMLElement>('pre code[class*="language-"]');

codeBlocks.forEach(async (codeElement) => {
  const block = codeElement.parentElement as HTMLElement;
  if (!block || block.id === 'getvalue-output') return;

  const lang = block.dataset.lang || 'js';
  const rawCode = block.innerText.trim();

  const html = await codeToHtml(rawCode, {
    lang,
    theme: 'github-dark',
  });

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  const highlightedBlock = wrapper.firstElementChild!;

  highlightedBlock.classList.add(
    'w-full',
    'overflow-x-auto',
    'overflow-y-hidden',
    'px-4',
    'py-3',
    'rounded-md',
    'bg-[#0d1117]',
  );

  const copyBtn = document.createElement('button');
  copyBtn.innerText = 'Copy';
  copyBtn.className =
    'absolute top-2 right-2 text-xs px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition';
  copyBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(rawCode);
    copyBtn.innerText = 'Copied!';
    setTimeout(() => (copyBtn.innerText = 'Copy'), 1500);
  });

  const wrapperDiv = document.createElement('div');
  wrapperDiv.className = 'relative mb-6';
  wrapperDiv.appendChild(copyBtn);
  wrapperDiv.appendChild(highlightedBlock);

  block.replaceWith(wrapperDiv);
});

