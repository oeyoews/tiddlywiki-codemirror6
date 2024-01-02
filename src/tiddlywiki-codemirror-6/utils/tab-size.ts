import { Compartment } from '@codemirror/state';
import { EditorState } from '@codemirror/state';
import config from './config';

// https://codemirror.net/examples/config/
const tabSizePlugin = () => {
  const tabSizeInstance = new Compartment();
  return tabSizeInstance.of(EditorState.tabSize.of(config.tabSize()));
};

export default tabSizePlugin;
