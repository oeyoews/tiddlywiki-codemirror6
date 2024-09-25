import { type Extension } from '@codemirror/state';
import { hoverTooltip, EditorView } from '@codemirror/view';

// 预览 [[xxx]] tiddler
// https://codepen.io/okikio/pen/NWjzyRG?editors=0010
export const wordHover: Extension = hoverTooltip(
  (view, pos, side) => {
    let { from, to, text } = view.state.doc.lineAt(pos);
    let start = pos;
    let end = pos;

    while (start > from && text[start - from - 1] !== '[') {
      start--;
    }

    while (end < to && text[end - from] !== ']') {
      end++;
    }

    if (
      text[start - from - 3] === '[' ||
      text[start - from - 3] === '{' ||
      text[start - from - 2] !== '[' ||
      text[end - from + 1] !== ']' ||
      text[end - from + 2] === ']'
    ) {
      return null;
    }

    // if ((start == pos && side < 0) || (end == pos && side > 0)) return null;

    const title = text.slice(start - from, end - from);
    // if (!$tw.wiki.tiddlerExists(title)) return null;
    if (!$tw.wiki.getTiddlerText(title)) return null;
    // if (title.startsWith('$:/')) return null;

    let previewNode = document.createElement('div');
    previewNode.className = 'cm-link-preview';
    try {
      if (!$tw.wiki.getTiddlerText(title)) {
        previewNode.textContent = 'Nothing ...';
      } else {
        const innerHTML = $tw.wiki.renderTiddler('text/html', title);
        previewNode.innerHTML = innerHTML;
      }
      previewNode.addEventListener('pointermove', (e: PointerEvent) => {
        let setCursor = false;
        if (e.ctrlKey && !setCursor) {
          previewNode.style.cursor = 'pointer';
          setCursor = true;
        } else if (!e.ctrlKey) {
          previewNode.style.cursor = 'text';
          setCursor = false;
        }
      });
      previewNode.addEventListener('click', (e: MouseEvent) => {
        e.preventDefault();
        if (e.ctrlKey) {
          previewNode.hidden = true; // 隐藏弹窗
          new $tw.Story().navigateTiddler(title);
        }
      });
    } catch (e) {
      return null;
    }

    return {
      pos: start,
      end,
      strictSide: true,
      // arrow: true,
      above: true,
      create(view: EditorView) {
        return { dom: previewNode };
      }
    };
  },
  {
    hideOnChange: true, // 'touch' option seems not work
    hoverTime: 300
  }
);

const linkpreviewStyle = EditorView.baseTheme({
  '.cm-link-preview': {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    // cursor: 'pointer',
    overflow: 'auto',
    maxWidth: '400px',
    maxHeight: '400px',
    padding: '6px',
    borderRadius: '8px',
    zIndex: '1001 !important' // not work
  },
  '.cm-tooltip': {
    border: 'none !important'
  }
});

export const linkHoverPreview: Extension[] = [wordHover, linkpreviewStyle];
