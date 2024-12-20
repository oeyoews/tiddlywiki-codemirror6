import { Completion, startCompletion } from '@codemirror/autocomplete';
import { IWidget } from '@/cm6/types/IWidget';
import { useSound } from '@/cm6/utils/capitalize';

const section = 'fields';
const type = 'cm-field';
const delimiter = '@field:';
const description = 'add fields for current tiddlers';

function snippets(widget: IWidget) {
  const allfields = $tw.wiki
    .filterTiddlers('[fields[]sort[title]]')
    .map((itme) => ({
      field: itme
    }));

  return allfields.map(
    (item) =>
      ({
        section,
        label: delimiter + item.field,
        displayLabel: item.field,
        type,
        boost: item.field.startsWith('$') ? 0 : 1,

        apply: (view, completion, from, to) => {
          view.dispatch({
            changes: { from, to, insert: '@' + item.field + ':' }
          });
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
