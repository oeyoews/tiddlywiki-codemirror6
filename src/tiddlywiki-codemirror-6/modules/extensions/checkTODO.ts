import { Decoration, DecorationSet } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import {
  ViewUpdate,
  ViewPlugin,
  WidgetType,
  EditorView
} from '@codemirror/view';

// md: support - [x] and - [ ] toggle checkbox
class CheckboxWidget extends WidgetType {
  constructor(readonly checked: boolean) {
    super();
  }

  eq(other: CheckboxWidget) {
    return other.checked == this.checked;
  }

  toDOM() {
    let wrap = document.createElement('span');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.className = 'cm-checkbox-toggle';
    let box = wrap.appendChild(document.createElement('input'));
    box.type = 'checkbox';
    box.style.cursor = 'pointer';
    box.style.marginLeft = '0.2em';
    box.checked = this.checked;
    return wrap;
  }

  ignoreEvent() {
    return false;
  }
}

const checkedBoxs = ['- [x]', '* [x]', '- [X]', '* [X]'];
const uncheckedBoxs = ['- [ ]', '* [ ]'];

function checkboxes(view: EditorView) {
  let widgets: any[] = [];
  for (let { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (node) => {
        if (node.name !== 'TaskMarker') return;
        const todoString = view.state.doc.sliceString(node.to - 5, node.to);
        let isChecked = checkedBoxs.includes(todoString);

        let deco = Decoration.widget({
          widget: new CheckboxWidget(isChecked),
          side: 1
        });

        widgets.push(deco.range(node.to));
      }
    });
  }
  return Decoration.set(widgets);
}

function toggleCheckbox(view: EditorView, pos: number) {
  let before = view.state.doc.sliceString(Math.max(0, pos - 5), pos);
  let change;
  if (uncheckedBoxs.includes(before)) {
    change = {
      from: pos - 5,
      to: pos,
      insert: checkedBoxs[0]
    };
  } else if (checkedBoxs.includes(before)) {
    change = {
      from: pos - 5,
      to: pos,
      insert: uncheckedBoxs[0]
    };
  } else return false;
  view.dispatch({ changes: change });
  return true;
}

export const markdownCheckboxPlugin = ViewPlugin.fromClass(
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
        let target = e.target as HTMLElement;
        if (
          target.nodeName == 'INPUT' &&
          target.parentElement!.classList.contains('cm-checkbox-toggle')
        )
          return toggleCheckbox(view, view.posAtDOM(target));
      }
    }
  }
);
