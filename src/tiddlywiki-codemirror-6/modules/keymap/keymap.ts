import {
  acceptCompletion,
  moveCompletionSelection,
  nextSnippetField
} from '@codemirror/autocomplete';
import { underlineSelection } from '../../extensions/underlineSelection';
import { KeyBinding } from '@codemirror/view';
import { gotoLine } from '@codemirror/search';

//  TODO: presnippetfield not work, snipkeymap
export const userKeymap: KeyBinding[] = [
  {
    key: 'Mod-h',
    preventDefault: true,
    run: underlineSelection
  },
  {
    key: 'Ctrl-i',
    scope: 'editor',
    run: acceptCompletion
  },
  {
    key: 'Ctrl-Shift-j',
    scope: 'editor',
    run: gotoLine
  },
  {
    key: 'Ctrl-j',
    scope: 'editor',
    // preventDefault: true,
    run: moveCompletionSelection(true) // 占位符
  },
  {
    key: 'Ctrl-k',
    scope: 'editor',
    preventDefault: true,
    run: moveCompletionSelection(false) // 占位符
  },
  {
    key: 'Tab',
    run: acceptCompletion
  }
];
