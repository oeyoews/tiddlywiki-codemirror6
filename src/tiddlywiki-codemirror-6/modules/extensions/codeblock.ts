// WIP
import { Decoration, DecorationSet } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import {
  ViewUpdate,
  ViewPlugin,
  WidgetType,
  EditorView
} from '@codemirror/view';

class CodeblockWidget extends WidgetType {
  constructor(readonly checked: string) {
    super();
  }

  eq(other: CodeblockWidget) {
    return other.checked == this.checked;
  }

  toDOM() {
    let wrap = document.createElement('span');
    let select = document.createElement('select');
    select.style.cursor = 'pointer';
    let option1 = document.createElement('option');
    option1.value = 'javascript';
    option1.text = 'javascript';
    option1.selected = true;
    select.append(option1);
    wrap.appendChild(select);
    return wrap;
  }

  ignoreEvent() {
    return false;
  }
}

function checkboxes(view: EditorView) {
  let widgets: any[] = [];
  for (let { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (node) => {
        if (!['CodeInfo', 'CodeMarker'].includes(node.name)) return;
        let type;
        if (node.name === 'CodeInfo') {
          type = view.state.doc
            .sliceString(node.from, node.to)
            .split(' ')
            .shift()!;
        }
        let deco = Decoration.widget({
          widget: new CodeblockWidget(type!),
          side: 1
        });

        widgets.push(deco.range(node.to));
      }
    });
  }
  return Decoration.set(widgets);
}

function updateCodeblockType(view: EditorView, pos: number) {
  const type = view.state.doc
    .lineAt(pos)
    .text.split(' ')
    .shift()
    ?.replace('```', '')!;
  let changes = { from: pos - type?.length, to: pos, insert: type };
  view.dispatch({ changes });
  return true;
}

export const codeBlockTogglePlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = checkboxes(view);
    }

    update(update: ViewUpdate) {
      if (
        update.docChanged ||
        update.viewportChanged ||
        syntaxTree(update.startState) != syntaxTree(update.state)
      )
        this.decorations = checkboxes(update.view);
    }
  },
  {
    decorations: (v) => v.decorations,

    eventHandlers: {
      mousedown: (e, view) => {
        let target = e.target as HTMLSelectElement;
        if (target.nodeName == 'SELECT') {
          return updateCodeblockType(view, view.posAtDOM(target));
        }
      }
    }
  }
);
