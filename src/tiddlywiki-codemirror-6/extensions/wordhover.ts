import { hoverTooltip } from '@codemirror/view';

export const wordHover = hoverTooltip((view, pos, side) => {
  let { from, to, text } = view.state.doc.lineAt(pos);
  let start = pos,
    end = pos;
  while (start > from && /\w/.test(text[start - from - 1])) start--;
  while (end < to && /\w/.test(text[end - from])) end++;
  if ((start == pos && side < 0) || (end == pos && side > 0)) return null;
  return {
    pos: start,
    end,
    above: true,
    create(view) {
      const dom = document.createElement('div');
      //   dom.textContent = text.slice(start - from, end - from);
      const title = text.slice(start - from, end - from);
      const innerHTML = $tw.wiki.renderTiddler('text/html', title);
      dom.innerHTML = innerHTML;
      dom.className = 'cm-image-preview';
      dom.style.cssText = 'border: none !important';
      dom.style.cursor = 'pointer';
      dom.addEventListener('click', () => {
        new $tw.Story().navigateTiddler(title);
      });
      return { dom };
    }
  };
});
