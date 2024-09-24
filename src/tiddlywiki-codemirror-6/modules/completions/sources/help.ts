import {
  Completion,
  snippetCompletion as snip
} from '@codemirror/autocomplete';
import { delimitersInfo } from '.';

const section = 'help';
const type = 'cm-help';
const delimiter = '/?';
const description = 'show help triggers';

function snippets(): Completion[] {
  const items = delimitersInfo.map((item) => ({
    section: item.section,
    delimiter: item.delimiters,
    type: item.type,
    info: item.description
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
