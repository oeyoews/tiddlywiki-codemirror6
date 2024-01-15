// WIP

import { selectedCompletion } from '@codemirror/autocomplete';
import { EditorState } from '@codemirror/state';
import {
  ViewUpdate,
  Decoration,
  DecorationSet,
  ViewPlugin,
  WidgetType,
  EditorView
} from '@codemirror/view';

class CompletionHint extends WidgetType {
  constructor(readonly text: string) {
    super();
  }

  override eq(other: CompletionHint): boolean {
    return this.text === other.text;
  }

  toDOM(): HTMLElement {
    console.log('hhhhhhhhhhhhhhhhhh');
    const span = document.createElement('span');
    span.className = 'cm-completionHint';
    span.textContent = this.text;
    return span;
  }
}

export const showCompletionHint = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet = Decoration.none;
    currentHint: string | null = null;

    update(update: ViewUpdate): void {
      console.log('hxxxx');
      const top = (this.currentHint = this.topCompletion(update.state));
      console.log(top);
      if (!top) {
        this.decorations = Decoration.none;
      } else {
        this.decorations = Decoration.set([
          Decoration.widget({
            widget: new CompletionHint(top),
            side: 1
          }).range(update.state.selection.main.head)
        ]);
      }
    }

    topCompletion(state: EditorState): string | null {
      const completion = selectedCompletion(state);
      if (!completion) {
        return null;
      }
      let { label, apply } = completion;
      if (typeof apply === 'string') {
        label = apply;
        apply = undefined;
      }
      if (
        apply ||
        label.length > 100 ||
        label.indexOf('\n') > -1 ||
        completion.type === 'secondary'
      ) {
        return null;
      }
      const pos = state.selection.main.head;
      const lineBefore = state.doc.lineAt(pos);
      if (pos !== lineBefore.to) {
        return null;
      }
      const partBefore = (
        label[0] === "'"
          ? /'(\\.|[^'\\])*$/
          : label[0] === '"'
            ? /"(\\.|[^"\\])*$/
            : /#?[\w$]+$/
      ).exec(lineBefore.text);
      if (partBefore && !label.startsWith(partBefore[0])) {
        return null;
      }
      return label.slice(partBefore ? partBefore[0].length : 0);
    }
  },
  { decorations: (p) => p.decorations }
);

export function contentIncludingHint(view: EditorView): string {
  const plugin = view.plugin(showCompletionHint);
  let content = view.state.doc.toString();
  if (plugin && plugin.currentHint) {
    const { head } = view.state.selection.main;
    content = content.slice(0, head) + plugin.currentHint + content.slice(head);
  }
  return content;
}
