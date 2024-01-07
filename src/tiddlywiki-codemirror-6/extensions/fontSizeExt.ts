import { EditorView } from '@codemirror/view';
import cmeConfig from '../cmeConfig';

export default function () {
  return EditorView.theme({
    '&.cm-editor': {
      fontSize: cmeConfig.fontsize()
    }
  });
}
