import {
  snippetCompletion as snip,
  Completion
} from '@codemirror/autocomplete';

const section = 'codeblock';
const type = 'cm-codeblock';
const delimiter = '```';
const description = 'generate codeblock';

const getBoostArrayFromArray = (arr: string[]) => {
  return arr
    .map((item, index) => {
      return index + 1;
    })
    .reverse();
};

function snippets() {
  const types = ['html', 'js', 'mermaid'];
  const cblTypes = types.map((item) => ({
    title: item
  }));

  return cblTypes.map(
    (item, index) =>
      snip(delimiter + `${item.title}\n#{1}\n` + delimiter, {
        label: delimiter + item.title,
        displayLabel: item.title,
        type: `cm-${item.title}`,
        section,
        boost: getBoostArrayFromArray(types)[index]
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
