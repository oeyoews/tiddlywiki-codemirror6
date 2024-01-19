import { Compartment } from '@codemirror/state';
import { EditorState } from '@codemirror/state';
import cm6 from '@/cm6/config';

// https://codemirror.net/examples/config/
const tabSizePlugin = () => {
  const tabSizeInstance = new Compartment();
  return tabSizeInstance.of(EditorState.tabSize.of(cm6.tabSize()));
};

export default tabSizePlugin;
