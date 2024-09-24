import {
  Completion,
  snippetCompletion as snip,
  startCompletion
} from '@codemirror/autocomplete';
import { delimitersInfo } from '.';
import { IWidget } from '@/cm6/types/IWidget';

const section = 'help';
const type = 'cm-help';
const delimiter = '/?';
const description = 'show help triggers';

function snippets(widget: IWidget): Completion[] {
  const items = delimitersInfo.map((item) => ({
    section: item.section,
    delimiter: item.delimiters,
    type: item.type,
    info: item.description
  }));

  return items.map((item) => ({
    section,
    label: delimiter + item.section,
    detail: item.delimiter,
    info: item.info,
    displayLabel: item.section,
    apply: (view, completion: Completion, from, to) => {
      view.dispatch({
        changes: { from, to, insert: item.delimiter }
      });
      startCompletion(view);
    },
    type: item.type
  }));

  return items.map((item) =>
    snip(item.delimiter, {
      section,
      label: delimiter + item.section,
      detail: item.delimiter,
      info: item.info,
      displayLabel: item.section,
      type: item.type
    })
  );
}

export default {
  section,
  type,
  delimiter,
  description,
  snippets
};
