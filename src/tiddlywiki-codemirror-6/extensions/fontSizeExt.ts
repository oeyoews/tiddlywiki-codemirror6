import { EditorView } from '@codemirror/view';
import cmeConfig from '../cmeConfig';

/** @see-also https://codemirror.net/examples/styling */
export default function () {
  return EditorView.theme({
    '&.cm-editor': {
      fontSize: cmeConfig.fontsize()
    }
  });
}
