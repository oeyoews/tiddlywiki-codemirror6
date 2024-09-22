import {
  snippetCompletion as snip,
  Completion
} from '@codemirror/autocomplete';

const section = 'codeblock';
const type = '';
const delimiter = '```';

const getIcontype = (text: string) => {
  let type: ICompletionIcons = 'keyword';
  switch (text) {
    case 'js':
      type = 'cm-js';
      break;
    case 'mermaid':
      type = 'cm-mermaid';
      break;
    case 'html':
      type = 'cm-html';
      break;
    default:
      break;
  }
  return type;
};

const getBoostArrayFromArray = (arr: string[]) => {
  return arr
    .map((item, index) => {
      return index + 1;
    })
    .reverse();
};

function snippets() {
  const types = ['js', 'mermaid', 'html'];
  const cblTypes = types.map((item) => ({
    title: item
  }));

  return cblTypes.map(
    (item, index) =>
      snip(delimiter + `${item.title}\n#{1}\n` + delimiter, {
        label: delimiter + item.title,
        displayLabel: item.title,
        type: getIcontype(item.title),
        section,
        boost: getBoostArrayFromArray(types)[index]
      }) as Completion
  );
}

export default {
  section,
  type,
  delimiter,
  snippets
};
