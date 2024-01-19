import { words } from '../snippets';

export function wordsSnippets() {
  return words.map((word) => ({
    label: word,
    displayLabel: word,
    type: 'cm-word'
  }));
}
