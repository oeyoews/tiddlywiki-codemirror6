import { EditorView } from '@codemirror/view';

export function lockEditorUI(view: EditorView) {
  const editorEl = view.dom;
  editorEl.classList.add('cm-locked');
}

export function unlockEditorUI(view: EditorView) {
  const editorEl = view.dom;
  editorEl.classList.remove('cm-locked');
}
