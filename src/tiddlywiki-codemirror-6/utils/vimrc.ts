import { Vim } from '@replit/codemirror-vim';
import { IWidget } from '../types';

// https://github.com/replit/codemirror-vim
export default function setVimKeymap(widget?: IWidget) {
  Vim.map('jk', '<Esc>', 'insert'); // in insert mode
  Vim.map('H', '0', 'normal');
  Vim.map('L', '$', 'normal');
  // TODO: 不接受文件名
  Vim.defineEx('write', 'w', () => {
    // TODO: save as
    console.log(widget?.editTitle);
  });
}
