import {
  acceptCompletion,
  moveCompletionSelection,
  nextSnippetField,
  startCompletion
} from '@codemirror/autocomplete';
import { underlineSelection } from '@/cm6/modules/extensions/underlineSelection';
import { EditorView, KeyBinding } from '@codemirror/view';
import { cursorSyntaxLeft, cursorSyntaxRight } from '@codemirror/commands';
import { IWidget } from '@/cm6/types/IWidget';
import { notify } from '@/cm6/config';
import { updateSaveStatus } from '@/cm6/modules/constants/saveStatus';
import { gotoLine } from '@codemirror/search';

const saveTiddlerCmd = (widget: IWidget) => {
  return (view: EditorView) => {
    const title = $tw.wiki.getTiddler(widget?.editTitle!)?.fields[
      'draft.title'
    ] as string;
    const text = view.state.doc.toString();
    const lines = view.state.doc.lineAt(1);
    $tw.wiki.setText(title, 'text', '', text);
    $tw.notifier.display(notify.save);
    updateSaveStatus(true);
    // HACK: to update codemirror6 state
    view.dispatch({
      changes: { from: lines.from, to: lines.to, insert: lines.text }
    });
    return true;
  };
};

export const userKeymap = (widget: IWidget): KeyBinding[] => {
  const keybinding: KeyBinding[] = [
    {
      key: 'Ctrl-s',
      preventDefault: true,
      run: saveTiddlerCmd(widget), // 有问题，浏览器优先级更高
      // shift: saveTiddlerCmd(widget),
      scope: 'editor',
      stopPropagation: true
    },
    {
      key: 'Mod-h',
      preventDefault: true,
      run: underlineSelection
    },
    {
      key: 'Ctrl-alt-r',
      preventDefault: true,
      scope: 'editor',
      stopPropagation: true,
      run: cursorSyntaxRight
    },
    {
      key: 'Ctrl-alt-l',
      preventDefault: true,
      scope: 'editor',
      stopPropagation: true,
      run: cursorSyntaxLeft
    },
    {
      key: 'Ctrl-i',
      scope: 'editor',
      run: acceptCompletion
    },
    {
      key: 'Ctrl-Shift-j',
      scope: 'editor',
      preventDefault: true,
      stopPropagation: true,
      run: gotoLine
    },
    {
      key: 'Ctrl-j',
      scope: 'editor',
      // preventDefault: true,
      // shift: moveCompletionSelection(true, 'page'),
      run: moveCompletionSelection(true) // 占位符
    },
    {
      key: 'Ctrl-k',
      scope: 'editor',
      preventDefault: true,
      // shift: moveCompletionSelection(false, 'page'),
      run: moveCompletionSelection(false) // 占位符
    },
    {
      key: 'Tab',
      run: acceptCompletion,
      shift: nextSnippetField // shift tab not work
    },
    // NOTE: need disable your ime `ctrl+space` to toggle method
    {
      key: 'Ctrl-Space',
      scope: 'editor',
      preventDefault: true,
      run: startCompletion
    }
  ];
  return keybinding;
};
