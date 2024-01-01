import { Compartment } from '@codemirror/state';
import { EditorState } from '@codemirror/state';

// https://codemirror.net/examples/config/
// TODO: support config
export const tabSizePlugin = () => {
  const tabSize = new Compartment();
  console.log($tw.wiki.getTiddlerText('$:/config/codemirror-6/closeBrackets'));
  return tabSize.of(EditorState.tabSize.of(2));
};
