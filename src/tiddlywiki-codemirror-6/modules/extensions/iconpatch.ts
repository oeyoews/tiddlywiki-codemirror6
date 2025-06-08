import { EditorView } from '@codemirror/view';

/** @see-also https://codemirror.net/examples/styling */
export default EditorView.theme({
  '.cm-completionIcon': {
    width: `unset !important`
  }
});
