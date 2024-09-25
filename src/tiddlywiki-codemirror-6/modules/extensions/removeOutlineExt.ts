import { EditorView } from '@codemirror/view';

/** 移除编辑器的outline */
export default EditorView.theme({
  '&.cm-focused': {
    outline: 'none' // remove editor outline style
  }
});
