// get all user templates to set current tiddler
// add new snippet
// add new template
import { Completion } from '@codemirror/autocomplete';
import cm6, { configBaseTitle } from '@/cm6/config';
import { IWidget } from '@/cm6/types/IWidget';
import { EditorView } from '@codemirror/view';

const items = $tw.wiki
  .filterTiddlers(
    '[all[shadows+tiddlers]tag[$:/tags/TextEditor/Templates]] [prefix[$:/templates/]] -[is[draft]]'
  )
  .map((item) => ({
    title: item
  }));

// export type IEventTypes = (typeof filetypes)[number]['title'];

const section = 'template';
const type = 'cm-template';
const delimiter = '@t';

function snippets(widget: IWidget) {
  return items.map(
    (item) =>
      ({
        section,
        label: delimiter + item.title,
        displayLabel: item.title, // displayLabel 会影响match underline
        type,
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
          // todo: 清空旧的field
          // $tw.wiki.setText(widget.editTitle, 'cap', '', undefined);
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
