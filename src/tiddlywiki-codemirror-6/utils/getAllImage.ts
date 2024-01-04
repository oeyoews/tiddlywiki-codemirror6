function getAllImages() {
  const allImageTiddlers = $tw.wiki.filterTiddlers('[!is[system]is[image]]');

  // support preview tiddler
  return allImageTiddlers.map((title) => ({
    label: `[img[${title}`,
    displayLabel: title,
    type: 'cm-image'
  }));
}

export const images = getAllImages();
