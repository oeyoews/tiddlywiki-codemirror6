import { keymap } from '@codemirror/view';
import { historyKeymap } from '@codemirror/commands';
import { closeBracketsKeymap } from '@codemirror/autocomplete';
import { searchKeymap } from '@codemirror/search';
import { foldKeymap } from '@codemirror/language';
import { completionKeymap } from '@codemirror/autocomplete';
import { userKeymap } from './keymap';
import { IWidget } from '@/cm6/types/IWidget';
// import { vscodeKeymap } from '@replit/codemirror-vscode-keymap';

export const cmkeymaps = (widget: IWidget) => {
  return keymap.of([
    ...closeBracketsKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...userKeymap(widget)
    // ...vscodeKeymap
  ]);
};
