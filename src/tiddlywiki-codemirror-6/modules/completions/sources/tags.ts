import { Completion } from '@codemirror/autocomplete';
import { menu } from '@/cm6/modules/constants/menu';
import { IWidget } from '@/cm6/types';
import triggerType from '@/cm6/modules/constants/triggerType';

export function tagSnippets(widget: IWidget) {
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
          const tags = $tw.wiki.getTiddler(widget.editTitle)?.fields?.tags;
          if (!tags?.includes(item.title)) {
            $tw.wiki.setText(
              widget.editTitle,
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
