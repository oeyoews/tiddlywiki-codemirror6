import { Completion } from '@codemirror/autocomplete';
import { IWidget } from '@/cm6/types/IWidget';

const section = 'tags';
const type = 'cm-tag';
const delimiter = '#';

function snippets(widget: IWidget) {
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
        label: delimiter + item.title,
        displayLabel: item.title,
        type,
        section,
        boost: item.title.startsWith('$') ? 0 : 1,

        apply: (view, completion, from, to) => {
          view.dispatch({
            changes: { from, to, insert: '' }
          });
          const tags = $tw.wiki.getTiddler(widget.editTitle)?.fields?.tags;
          // use tm-add-tag is better.
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

export default {
  section,
  type,
  delimiter,
  snippets
};
