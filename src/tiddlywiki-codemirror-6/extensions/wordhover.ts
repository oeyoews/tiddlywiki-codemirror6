import { hoverTooltip } from '@codemirror/view';

// WIP
// 匹配特殊格式
export const wordHover = hoverTooltip((view, pos, side) => {
  let { from, to, text } = view.state.doc.lineAt(pos);
  let start = pos;
  let end = pos;

  while (start > from && /\w/.test(text[start - from - 1])) {
    start--;
  }

  if (text[start - 2] !== '[') return null; // cm6 是从 1 开始计算的

  while (end < to && /\w/.test(text[end - from])) {
    end++;
  }

  if ((start == pos && side < 0) || (end == pos && side > 0)) return null;

  const title = text.slice(start - from, end - from);
  if (!$tw.wiki.tiddlerExists(title)) return null;

  const dom = document.createElement('div');
  try {
    const innerHTML = $tw.wiki.renderTiddler('text/html', title);
    dom.innerHTML = innerHTML;
    dom.className = 'cm-image-preview';
    dom.style.cssText = 'border: none !important';
    dom.style.cursor = 'pointer';
    dom.addEventListener('click', () => {
      new $tw.Story().navigateTiddler(title);
    });
  } catch (e) {
    return null;
  }

  return {
    pos: start,
    end,
    above: true,
    create(view) {
      return { dom };
    }
  };
});
