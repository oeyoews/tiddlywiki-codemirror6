import { showPanel, EditorView, Panel } from '@codemirror/view';
import type { Text } from '@codemirror/state';

function charsCount(doc: Text) {
  return doc.length + ' chars';
}

function charCountPanel(view: EditorView): Panel {
  let dom = document.createElement('div');
  dom.style.cssText = 'color: grey; font-size:0.8rem;';
  dom.textContent = charsCount(view.state.doc);

  return {
    dom,
    update(update) {
      if (update.docChanged) dom.textContent = charsCount(update.state.doc);
    }
  };
}

export function charsExtension() {
  return showPanel.of(charCountPanel);
}
