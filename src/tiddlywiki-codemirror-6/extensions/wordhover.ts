import { type Extension } from '@codemirror/state';
import { hoverTooltip, EditorView } from '@codemirror/view';

// https://codepen.io/okikio/pen/NWjzyRG?editors=0010
// WIP
// 匹配特殊格式
export const wordHover: Extension = hoverTooltip(
  (view, pos, side) => {
    let { from, to, text } = view.state.doc.lineAt(pos);
    let start = pos;
    let end = pos;

    while (
      start > from &&
      /[\w:$.\-/\s\/\u4e00-\u9fa5]/.test(text[start - from - 1])
    ) {
      console.log(text[start - from - 1]);
      start--;
    }

    if (text[start - from - 1] !== '[' && text[end - from + 1] !== ']') {
      console.log('not a link');
      return null;
    }

    while (end < to && /[\w:$.\-\//\s\u4e00-\u9fa5]/.test(text[end - from])) {
      console.log(text[end - from]);
      end++;
    }

    if ((start == pos && side < 0) || (end == pos && side > 0)) return null;

    const title = text.slice(start - from, end - from);
    console.log(title);
    if (!$tw.wiki.tiddlerExists(title)) return null;
    if (title.startsWith('$:/')) return null;

    let previewNode = document.createElement('div');
    try {
      const innerHTML = $tw.wiki.renderTiddler('text/html', title);
      previewNode.innerHTML = innerHTML;
      previewNode.addEventListener('click', () => {
        new $tw.Story().navigateTiddler(title);
      });
      previewNode.className = 'cm-link-preview';
    } catch (e) {
      return null;
    }

    return {
      pos: start,
      end,
      above: true,
      create(view: EditorView) {
        return { dom: previewNode };
      }
    };
  },
  {
    hideOnChange: false, // 'touch' option seems not work
    hoverTime: 300
  }
);

// 最外层有个 wrapper, 无法修改
const linkpreviewStyle = EditorView.baseTheme({
  '.cm-link-preview': {
    border: '1px dash gray',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer',
    overflow: 'auto',
    // width: '300px',
    maxWidth: '600px',
    maxheight: '200px',
    padding: '8px'
  }
});

export const linkHoverPreview: Extension[] = [wordHover, linkpreviewStyle];
