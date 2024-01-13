import { EditorView } from '@codemirror/view';
import cm6 from '../cm6';

/** @see-also https://codemirror.net/examples/styling */
export default function () {
  return EditorView.theme({
    '&.cm-editor': {
      fontSize: cm6.fontsize()
    }
  });
}
