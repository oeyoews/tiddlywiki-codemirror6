import { EditorView } from '@codemirror/view';

export default EditorView.theme({
  '&.cm-focused': {
    outline: 'none' // remove editor outline style
  }
});
