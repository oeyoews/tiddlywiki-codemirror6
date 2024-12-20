import { Extension } from '@codemirror/state';
import { DecorationSet, EditorView, ViewUpdate } from '@codemirror/view';
import { Decoration, ViewPlugin, WidgetType } from '@codemirror/view';

// copyed from https://discuss.codemirror.net/t/decorating-newline-characters/5767/4
/** highlight newline */
class NewlineWidget extends WidgetType {
  toDOM() {
    const span = document.createElement('span');
    span.className = 'cm-newline';
    span.textContent = '↵';
    return span;
  }
}

function highlightNewLine(): Extension {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = this.getDecorations(view);
      }

      getDecorations(view: EditorView) {
        const widgets = [];
        const cursorLine = view.state.doc.lineAt(
          view.state.selection.main.head
        ); // 获取光标所在行
        for (const { from, to } of view.visibleRanges) {
          for (let pos = from; pos <= to; ) {
            const line = view.state.doc.lineAt(pos);
            if (line.number === cursorLine.number) {
              // 跳过光标所在行
              pos = line.to + 1;
              continue;
            }
            if (line.length === 0) {
              widgets.push(
                Decoration.widget({
                  widget: new NewlineWidget(),
                  side: 1
                }).range(pos)
              );
            } else {
              widgets.push(
                Decoration.widget({
                  widget: new NewlineWidget(),
                  side: 1
                }).range(line.to)
              );
            }
            pos = line.to + 1;
          }
        }
        return Decoration.set(widgets, true);
      }

      update(update: ViewUpdate) {
        if (
          update.docChanged ||
          update.viewportChanged ||
          update.selectionSet
        ) {
          this.decorations = this.getDecorations(update.view);
        }
      }
    },
    {
      decorations: (v) => v.decorations
    }
  );
}

const hyperNewlineStyle = EditorView.baseTheme({
  '.cm-newline': {
    color: 'currentColor',
    'pointer-events': 'none',
    opacity: 0.3
  }
});

export default [highlightNewLine(), hyperNewlineStyle];
