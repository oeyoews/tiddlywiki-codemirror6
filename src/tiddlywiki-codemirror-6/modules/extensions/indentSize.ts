import { Compartment } from '@codemirror/state';
import { EditorState } from '@codemirror/state';
import cm6 from '@/cm6/config';

// https://codemirror.net/examples/config/
const indentSizePlugin = () => {
  const indentSizeInstance = new Compartment();
  return indentSizeInstance.of(EditorState.tabSize.of(cm6.indentSize()));
};

export default indentSizePlugin;
