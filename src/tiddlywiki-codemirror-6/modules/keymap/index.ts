import { keymap } from '@codemirror/view';
import { historyKeymap } from '@codemirror/commands';
import { closeBracketsKeymap } from '@codemirror/autocomplete';
import { searchKeymap } from '@codemirror/search';
import { foldKeymap } from '@codemirror/language';
import { completionKeymap } from '@codemirror/autocomplete';
import { userKeymap } from './keymap';
// import { vscodeKeymap } from '@replit/codemirror-vscode-keymap';

export const cmkeymaps = keymap.of([
  ...closeBracketsKeymap,
  ...searchKeymap,
  ...historyKeymap,
  ...foldKeymap,
  ...completionKeymap,
  ...userKeymap
  // ...vscodeKeymap
]);
