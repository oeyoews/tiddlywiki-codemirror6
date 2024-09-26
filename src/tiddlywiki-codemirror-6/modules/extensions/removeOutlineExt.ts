import { EditorView } from '@codemirror/view';

// TODO: 失效了？？？ 正常情况下也看不到outline 了
// https://discuss.codemirror.net/t/css-style-for-border-of-editor/3097
/** 移除编辑器的outline */
export default EditorView.theme({
  '&.cm-focused': {
    outline: 'none' // remove editor outline style
  }
});
