import { Completion } from '@codemirror/autocomplete';
import { menu } from 'src/tiddlywiki-codemirror-6/modules/config/menu';
import { capitalize } from 'src/tiddlywiki-codemirror-6/utils/capitalize';
import triggerType from 'src/tiddlywiki-codemirror-6/utils/triggerType';

export function filetypeSnippets() {
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
          const draftTitle = $tw.wiki.filterTiddlers(
            '[is[draft]sort[modified]]'
          );
          // TODO: 传入 widget
          if (draftTitle.length > 1) {
            return;
          }
          $tw.wiki.setText(draftTitle[0], 'type', '', item.text, {
            suppressTimestamp: false
          });
        }
      }) as Completion
  );
}
