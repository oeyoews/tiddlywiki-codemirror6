import { Completion } from '@codemirror/autocomplete';
import { menu } from 'src/tiddlywiki-codemirror-6/modules/config/menu';
import triggerType from 'src/tiddlywiki-codemirror-6/utils/triggerType';

export function tagSnippets() {
  // @ts-ignore
  //   const tags = Object.keys($tw.wiki.getTagMap()).map((tag) => ({
  //     title: tag
  //   })).sort;
  const tags = $tw.wiki.filterTiddlers('[all[tags]]').map((tag) => ({
    title: tag
  }));

  return tags.map(
    (item) =>
      ({
        label: triggerType.tag + item.title,
        displayLabel: item.title,
        type: 'cm-tag',
        section: menu.tags,
        boost: item.title.startsWith('$') ? 0 : 1,

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
          const tags = $tw.wiki.getTiddler(draftTitle[0])?.fields?.tags;
          if (!tags?.includes(item.title)) {
            $tw.wiki.setText(
              draftTitle[0],
              'tags',
              '',
              tags ? tags.join(' ') + ` ${item.title}` : ` ${item.title}`,
              {
                suppressTimestamp: false
              }
            );
          }
        }
      }) as Completion
  );
}
