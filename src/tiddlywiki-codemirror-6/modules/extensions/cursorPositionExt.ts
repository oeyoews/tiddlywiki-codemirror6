import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { Tooltip, showTooltip } from '@codemirror/view';
import { StateField } from '@codemirror/state';

// TODO: completion close tooltip
// change info tip
const cursorTooltipField = StateField.define<readonly Tooltip[]>({
  create: getCursorTooltips,

  update(tooltips, tr) {
    if (!tr.docChanged && !tr.selection) return tooltips;
    return getCursorTooltips(tr.state);
  },

  provide: (f) => showTooltip.computeN([f], (state) => state.field(f))
});

function getCursorTooltips(state: EditorState): readonly Tooltip[] {
  return state.selection.ranges
    .filter((range) => range.empty)
    .map((range) => {
      let line = state.doc.lineAt(range.head);
      let text = line.number + ':' + (range.head - line.from);
      return {
        pos: range.head,
        above: true,
        strictSide: true,
        arrow: true,
        create: () => {
          let dom = document.createElement('div');
          dom.className = 'cm-tooltip-cursor';
          dom.textContent = text;
          return { dom };
        }
      };
    });
}

// https://codemirror.net/examples/styling/
const cursorTooltipBaseTheme = EditorView.baseTheme({
  '.cm-tooltip.cm-tooltip-cursor': {
    backgroundColor: '#66b',
    color: 'white',
    border: 'none',
    padding: '2px 7px',
    borderRadius: '4px',
    '& .cm-tooltip-arrow:before': {
      borderTopColor: '#66b'
    },
    '& .cm-tooltip-arrow:after': {
      borderTopColor: 'transparent'
    }
  }
});

export function cursorTooltip() {
  return [cursorTooltipField, cursorTooltipBaseTheme];
}
