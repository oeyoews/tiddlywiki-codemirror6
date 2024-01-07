import { Vim } from '@replit/codemirror-vim';

// https://github.com/replit/codemirror-vim
export default function setVimKeymap() {
  Vim.map('jk', '<Esc>', 'insert'); // in insert mode
  Vim.map('H', '0', 'normal');
  Vim.map('L', '$', 'normal');
  Vim.defineEx('write', 'w', function () {
    console.log('write');
  });
}
