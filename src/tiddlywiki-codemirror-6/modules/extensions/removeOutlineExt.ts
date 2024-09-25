import { EditorView } from '@codemirror/view';

// TODO: 失效了？？？
/** 移除编辑器的outline */
export default EditorView.theme({
  '&.cm-focused': {
    outline: 'none' // remove editor outline style
  }
});
