import { Compartment } from '@codemirror/state';
import { EditorState } from '@codemirror/state';
import config from './config';

// https://codemirror.net/examples/config/
const tabSizePlugin = () => {
  const tabSize = new Compartment();
  return tabSize.of(EditorState.tabSize.of(config.tabSize()));
};

export default tabSizePlugin;
