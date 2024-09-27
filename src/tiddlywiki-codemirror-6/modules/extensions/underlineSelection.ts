// https://codemirror.net/examples/decoration/
import {
  EditorView,
  Decoration,
  DecorationSet,
  Command
} from '@codemirror/view';
import { StateField, StateEffect } from '@codemirror/state';

const addUnderline = StateEffect.define<{ from: number; to: number }>({
  map: ({ from, to }, change) => ({
    from: change.mapPos(from),
    to: change.mapPos(to)
  })
});

const underlineMark = Decoration.mark({ class: 'cm-underline' });

const underlineField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(underlines, tr) {
    underlines = underlines.map(tr.changes);
    for (let e of tr.effects)
      if (e.is(addUnderline)) {
        underlines = underlines.update({
          add: [underlineMark.range(e.value.from, e.value.to)]
        });
      }
    return underlines;
  },
  provide: (f) => EditorView.decorations.from(f)
});

const underlineTheme = EditorView.baseTheme({
  '.cm-underline': {
    background: 'yellow'
    // background: 'mediumpurple',
    // padding: '0 2px',
    // borderRadius: '4px',
    // color: 'black'
  }
});

export function underlineSelection(view: EditorView) {
  let effects: StateEffect<unknown>[] = view.state.selection.ranges
    .filter((r) => !r.empty)
    .map(({ from, to }) => addUnderline.of({ from, to }));
  if (!effects.length) return false;

  if (!view.state.field(underlineField, false))
    effects.push(StateEffect.appendConfig.of([underlineField, underlineTheme]));
  view.dispatch({ effects });
  return true;
}
