import { Completion } from '@codemirror/autocomplete';
import { menu } from '@/cm6/modules/constants/menu';
import { IWidget } from '@/cm6/types/IWidget';
import { capitalize } from '@/cm6/utils/capitalize';
import triggerType from '@/cm6/modules/constants/triggerType';
import { type IMode } from '@/cm6/config';

const getIcontype = (text: IMode) => {
  let type: ICompletionIcons = 'keyword';
  switch (text) {
    case 'text/plain':
      type = 'cm-plain';
      break;
    case 'image/svg+xml':
      type = 'cm-svg';
      break;
    // @ts-expect-error
    case 'image/gif':
      type = 'cm-gif';
      break;
    case 'text/x-markdown':
    case 'text/markdown':
      type = 'cm-markdown';
      break;
    case 'text/vnd.tiddlywiki':
    // @ts-expect-error
    case 'text/x-tiddlywiki':
      type = 'cm-tiddlywiki';
      break;
    case 'text/css':
      type = 'cm-css';
      break;
    case 'application/javascript':
      type = 'cm-js';
      break;
    // @ts-expect-error
    case 'image/jpeg':
    // @ts-expect-error
    case 'image/png':
      type = 'cm-image';
      break;
    case 'application/json':
      type = 'cm-json';
      break;
    case 'text/html':
      type = 'cm-json';
      break;
    default:
      break;
  }
  return type;
};

export function filetypeSnippets(widget: IWidget) {
  const filetypes = $tw.wiki
    .filterTiddlers('[all[tiddlers+shadows]prefix[$:/language/Docs/Types/]]')
    .map((item) => ({
      title: item
        .split('/')
        .pop()!
        .replace('vnd.', '')
        .replace('x-tiddlywiki', 'tiddlywiki2'),
      text: item.replace('$:/language/Docs/Types/', '')
    }));

  return filetypes.map(
    (item) =>
      ({
        label: triggerType.filetype + item.title,
        displayLabel: capitalize(item.title),
        type: getIcontype(item.text as IMode),
        section: menu.filetypes,
        boost:
          item.text === 'text/markdown' || item.text === 'text/vnd.tiddlywiki'
            ? 1
            : 0,
        apply: (view, completion, from, to) => {
          view.dispatch({
            changes: { from, to, insert: '' }
          });
          // TODO: 或者使用 widget.editTitle 替换 title
          // TODO: 传入 widget
          $tw.wiki.setText(widget.editTitle, 'type', '', item.text, {
            suppressTimestamp: false
          });
        }
      }) as Completion
  );
}
