export function getAllTiddlers(delimiters = '[[') {
  // TODO: 做成配置
  const allTiddlers = $tw.wiki.filterTiddlers(
    '[all[tiddlers+shadows]!has[draft.of]!prefix[$:/status]!preifx[$:/temp]]'
  );

  // support preview tiddler
  return allTiddlers.map((title) => ({
    label: delimiters + title,
    displayLabel: title,
    type: 'cm-tiddler'
  }));
}
