import { Compartment } from '@codemirror/state';
import { EditorState } from '@codemirror/state';
import cmeConfig from '../cmeConfig';

// https://codemirror.net/examples/config/
const tabSizePlugin = () => {
  const tabSizeInstance = new Compartment();
  return tabSizeInstance.of(EditorState.tabSize.of(cmeConfig.tabSize));
};

export default tabSizePlugin;
