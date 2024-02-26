import { EditorView } from '@codemirror/view';
import cm6 from '@/cm6/config';

/** @see-also https://codemirror.net/examples/styling */
export default function () {
  let font = $tw.wiki.getTiddlerText(
    '$:/themes/tiddlywiki/vanilla/settings/editorfontfamily'
  );
  if (!font) {
    font = cm6.fontFamily();
  }

  return EditorView.theme({
    '.cm-scroller': {
      fontFamily: font!
    },
    '.cm-tooltip-autocomplete > ul': {
      fontFamily: `${font} !important`
    },
    '&.cm-editor': {
      fontSize: cm6.fontsize()
    }
  });
}
