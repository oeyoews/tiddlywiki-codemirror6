import { Completion } from '@codemirror/autocomplete';
import { menu } from '@/cm6/modules/config/menu';
import { IWidget } from '@/cm6/types';
import { capitalize } from '@/cm6/utils/capitalize';
import triggerType from '@/cm6/utils/triggerType';

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
        type: 'keyword',
        section: menu.filetypes,
        boost:
          item.text === 'text/markdown' || item.text === 'text/vnd.tiddlywiki'
            ? 1
            : 0,
        apply: (view, completion, from, to) => {
          view.dispatch({
            changes: { from, to, insert: '' }
            // selection: { anchor: cursorEndPosition, head: cursorEndPosition }
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
