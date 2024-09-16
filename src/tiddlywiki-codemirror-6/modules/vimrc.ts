import { Vim } from '@replit/codemirror-vim';
import { IWidget } from '../types/IWidget';
import cm6, { notify } from '@/cm6/config';
export default function setVimKeymap(widget: IWidget) {
  cm6.vimJK() && Vim.map('jk', '<Esc>', 'insert'); // in insert mode
  Vim.map('H', '0', 'normal');
  Vim.map('L', '$', 'normal');

  // TODO: update panel save status
  const saveTiddler = () => {
    const title = $tw.wiki.getTiddler(widget?.editTitle!)?.fields[
      'draft.title'
    ] as string;
    const text = $tw.wiki.getTiddlerText(widget?.editTitle!);

    // NOTE: only update text, not include fields
    $tw.wiki.setText(title, 'text', '', text);
    $tw.notifier.display(notify.save);

    // not work
    // const childWidget = widget?.children[0].parentWidget!;
    // childWidget.dispatchEvent({
    //   type: 'tm-save-tiddler',
    //   param: title
    // });

    // not work still
    // $tw.rootWidget.invokeActionString();

    // work
    // $tw.rootWidget.dispatchEvent({ type: 'tm-modal', param: 'GettingStarted' });
  };

  const copyTiddler = () => {
    const text = $tw.wiki.getTiddlerText(widget?.editTitle!);
    navigator.clipboard.writeText(text!);
    $tw.notifier.display(notify.copy);
  };

  // name, prefix, fn
  Vim.defineEx('copy', 'c', copyTiddler);
  Vim.defineEx('write', 'w', saveTiddler);
}
