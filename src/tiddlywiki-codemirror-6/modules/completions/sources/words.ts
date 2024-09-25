import { Completion } from '@codemirror/autocomplete';
import { words } from '../builtin/snippets';

const section = 'words';
const type = 'cm-word';
const description = 'words';
const delimiters = '';

function snippets() {
  return words.map(
    (word) =>
      ({
        section,
        label: word,
        // commitCharacters: ['.'],
        // displayLabel: word,
        type: 'cm-word'
      }) as Completion
  );
}

export default {
  section,
  type,
  description,
  snippets
};
