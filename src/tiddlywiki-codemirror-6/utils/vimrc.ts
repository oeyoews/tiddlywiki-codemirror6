import { Vim } from '@replit/codemirror-vim';
import { IWidget } from '../types';

// https://github.com/replit/codemirror-vim
export default function setVimKeymap(widget?: IWidget) {
  Vim.map('jk', '<Esc>', 'insert'); // in insert mode
  Vim.map('H', '0', 'normal');
  Vim.map('L', '$', 'normal');
  Vim.defineEx('write', 'w', () => {
    // $tw.rootWidget.invokeActionString();
    // $tw.rootWidget.dispatchEvent({
    //   type: 'tm-new-tiddler',
    //   param: widget?.editTitle
    // });
    // $tw.rootWidget.dispatchEvent({ type: 'tm-modal', param: 'GettingStarted' });
  });
}
