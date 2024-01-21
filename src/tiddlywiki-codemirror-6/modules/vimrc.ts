import { Vim } from '@replit/codemirror-vim';
import { IWidget } from '../types/IWidget';
import cm6 from '@/cm6/config';

// TODO: support navigator clipboard
// https://github.com/replit/codemirror-vim
export default function setVimKeymap(widget?: IWidget) {
  cm6.vimJK() && Vim.map('jk', '<Esc>', 'insert'); // in insert mode
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
