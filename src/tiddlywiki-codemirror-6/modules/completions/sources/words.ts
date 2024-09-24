import { Completion } from '@codemirror/autocomplete';
import { words } from '../snippets';

export default {
  section: 'Word',
  type: 'cm-word',
  delimiter: '',
  description: '',
  snippets: wordsSnippets
};

export function wordsSnippets() {
  return words.map((word) => ({
    label: word,
    // displayLabel: word,
    type: 'cm-word'
  })) as Completion[];
}
