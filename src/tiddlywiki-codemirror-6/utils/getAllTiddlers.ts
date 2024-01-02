import { snippetCompletion } from '@codemirror/autocomplete';

export function getAllTiddlers(delimiters = '[[') {
  // TODO: 做成配置
  const allTiddlers = $tw.wiki.filterTiddlers('[!is[system]!has[draft.of]]');

  // support preview tiddler
  return allTiddlers.map((title) => ({
    label: delimiters + title,
    displayLabel: title,
    type: 'keyword'
  }));
}
