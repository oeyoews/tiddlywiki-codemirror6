import {
  acceptCompletion,
  moveCompletionSelection,
  nextSnippetField,
  startCompletion
} from '@codemirror/autocomplete';
import { underlineSelection } from '@/cm6/modules/extensions/underlineSelection';
import { KeyBinding } from '@codemirror/view';
import { cursorSyntaxLeft, cursorSyntaxRight } from '@codemirror/commands';

// add keymap, press ? to show a modal tip
//  TODO: presnippetfield not work, snipkeymap
export const userKeymap: KeyBinding[] = [
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
  // {
  //   key: 'Ctrl-Shift-j',
  //   scope: 'editor',
  //   run: gotoLine
  // },
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
