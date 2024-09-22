import {
  Completion,
  snippetCompletion as snip
} from '@codemirror/autocomplete';
import { delimitersInfo } from '.';

const section = 'help';
const type = 'cm-help';
const delimiter = '/?';

function snippets(): Completion[] {
  const items = delimitersInfo.map((item) => ({
    section: item.section,
    delimiter: item.delimiters
  }));

  return items.map((item) =>
    snip(item.delimiter, {
      section,
      label: delimiter + item.section,
      detail: item.delimiter,
      // info: item.name,
      displayLabel: item.section,
      type: 'cm-help'
    })
  );
}

export default {
  section,
  type,
  delimiter,
  snippets
};
