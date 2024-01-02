import { snippetCompletion } from '@codemirror/autocomplete';

export function getAllImages() {
  const allImageTiddlers = $tw.wiki.filterTiddlers('[!is[system]is[image]]');

  // support preview tiddler
  return allImageTiddlers.map((title) =>
    snippetCompletion(`[img[${title}`, {
      label: `[img[${title}`,
      displayLabel: title,
      type: 'keyword'
    })
  );
}
