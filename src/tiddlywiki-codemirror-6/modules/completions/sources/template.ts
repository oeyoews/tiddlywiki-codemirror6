import { Completion } from '@codemirror/autocomplete';
import { IWidget } from '@/cm6/types/IWidget';
import { EditorView } from '@codemirror/view';

// export type IEventTypes = (typeof filetypes)[number]['title'];

const section = 'template';
const type = 'cm-template';
const delimiter = '@t';

const renderInfo = (tiddler: string) => {
  const {
    bag,
    title,
    revision,
    creator,
    created,
    modified,
    modifier,
    ...fields
  } = $tw.wiki.getTiddler(tiddler)!.fields;
  const tableNode = document.createElement('table');
  Object.entries(fields).forEach(([key, value]) => {
    return (tableNode.innerHTML += `<tr><td>${key}</td><td>${value}</td></tr>`);
  });
  // console.log(tableNode);
  return tableNode;
};

function snippets(widget: IWidget) {
  let items = $tw.wiki
    .filterTiddlers(
      '[all[shadows+tiddlers]tag[$:/tags/TextEditor/Templates]] [prefix[$:/templates/]] -[is[draft]]'
    )
    .map((item) => ({
      title: item
    }));

  if (!items.length) {
    items = [
      {
        title: 'No template found, click me to create one first'
      }
    ];
    return items.map(
      (item) =>
        ({
          section,
          type,
          label: delimiter + item.title,
          displayLabel: item.title,
          apply: (view: EditorView, completion: Completion, from, to) => {
            view.dispatch({
              changes: { from: 0, to, insert: '' }
            });
            widget.dispatchEvent({
              type: 'tm-new-tiddler',
              paramObject: {
                title: '$:/templates/new'
              }
            });
          }
        }) as Completion
    );
  }

  return items.map(
    (item) =>
      ({
        section,
        type,
        label: delimiter + item.title,
        displayLabel: item.title.split('/').pop()!, // displayLabel 会影响match underline
        info: () => renderInfo(item.title),
        apply: (view: EditorView, completion: Completion, from, to) => {
          // $tw.wiki.setText(widget.editTitle, 'draft.title', '', item.title);
          const {
            title,
            revision,
            creator,
            created,
            modified,
            modifier,
            ...fields
          } = $tw.wiki.getTiddler(item.title)!.fields;
          const {
            title: oldTitle,
            'draft.title': oldDTitle,
            'draft.of': oldTitleOf,
            revision: oldRevision,
            creator: oldCreator,
            created: oldCreated,
            modified: oldModified,
            modifier: oldModifier,
            ...oldfields
          } = $tw.wiki.getTiddler(widget.editTitle)!.fields;

          Object.entries(oldfields).forEach(([key]) => {
            $tw.wiki.setText(widget.editTitle, key, '', undefined);
          });
          Object.entries(fields).forEach(([key, value]) => {
            $tw.wiki.setText(widget.editTitle, key, '', value as any);
          });
          view.dispatch({
            changes: { from: 0, to, insert: fields.text }
            // selection: { anchor: cursorEndPosition, head: cursorEndPosition }
          });
          // 置空 text
          // $tw.wiki.setText(widget.editTitle, 'text', '', '');
          // $tw.wiki.setText(widget.editTitle, 'text', '', fields.text);
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
