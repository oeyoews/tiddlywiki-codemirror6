import { Completion } from '@codemirror/autocomplete';
import { IWidget } from '@/cm6/types/IWidget';

const section = 'tags';
const type = 'cm-tag';
const delimiter = '#';
const description = 'add tags for current tiddlers';

function snippets(widget: IWidget) {
  // @ts-ignore
  //   const tags = Object.keys($tw.wiki.getTagMap()).map((tag) => ({
  //     title: tag
  //   })).sort;
  const alltags = $tw.wiki.filterTiddlers('[all[tags]]');
  const currentTiddlertags = $tw.wiki.getTiddler(widget.editTitle)?.fields
    ?.tags;

  const filteredAllTags = alltags.filter(
    (tag) => !currentTiddlertags?.includes(tag)
  );

  const tags = filteredAllTags.map((tag) => ({
    title: tag
  }));

  return tags.map(
    (item) =>
      ({
        section,
        label: delimiter + item.title,
        displayLabel: item.title,
        type,
        boost: item.title.startsWith('$') ? 0 : 1,

        apply: (view, completion, from, to) => {
          view.dispatch({
            changes: { from, to, insert: '' }
          });

          const actionString = (
            tiddler: string,
            tag: string
          ) => `<$fieldmangler tiddler="${tiddler}">
<$action-sendmessage $message="tm-add-tag" $param="${tag}"/>
</$fieldmangler>`;

          console.log(currentTiddlertags);
          $tw.rootWidget.invokeActionString(
            actionString(widget.editTitle, item.title)
          );
        }
      }) as Completion
  );
}

export default {
  section,
  type,
  delimiter,
  description,
  snippets
};
