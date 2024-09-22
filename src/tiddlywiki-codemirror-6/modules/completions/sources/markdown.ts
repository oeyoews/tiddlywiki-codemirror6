import { snippetCompletion as snip } from '@codemirror/autocomplete';

const section = 'md';
const type = 'keyword';
const delimiter = ':::';

function snippets() {
  const tags = [
    'note',
    'info',
    'todo',
    'important',
    'tip',
    'success',
    'question',
    'warning',
    'caution',
    'fail',
    'danger',
    'error',
    'bug',
    'example',
    'snippet',
    'abstract',
    'summary',
    'quote',
    'cite',
    'see-also'
  ].map((item) => ({
    title: item
  }));

  return tags.map((item) =>
    snip(`${delimiter}${item.title}\n#{text}\n${delimiter}`, {
      label: delimiter + item.title,
      displayLabel: item.title,
      type: 'keyword',
      section
    })
  );
}

export default {
  section,
  type,
  delimiter,
  snippets
};
