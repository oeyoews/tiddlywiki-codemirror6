import { Compartment } from '@codemirror/state';
import { EditorState } from '@codemirror/state';
import { config } from './config';

// https://codemirror.net/examples/config/
export const tabSizePlugin = () => {
  const tabSize = new Compartment();
  return tabSize.of(EditorState.tabSize.of(Number(config.tabSize())));
};
