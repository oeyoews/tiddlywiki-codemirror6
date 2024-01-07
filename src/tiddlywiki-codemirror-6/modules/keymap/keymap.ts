import { acceptCompletion } from '@codemirror/autocomplete';
import { underlineSelection } from '../../extensions/underlineSelection';

export const userKeymap = [
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
    key: 'Tab',
    run: acceptCompletion
  }
];
