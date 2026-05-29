import { EditorView } from '@codemirror/view';
import { useSound } from '@/cm6/utils/sound';

/** Play sound only on user typing (not paste, completion apply, etc.). */
export default EditorView.updateListener.of((update) => {
  if (!update.docChanged) return;

  const typed = update.transactions.some(
    (tr) => tr.isUserEvent('input.type') || tr.isUserEvent('input.compose')
  );

  if (typed) useSound();
});
