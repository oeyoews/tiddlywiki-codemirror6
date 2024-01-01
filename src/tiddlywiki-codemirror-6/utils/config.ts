const baseTitle = '$:/config/codemirror-6/';
function getConfig(title: string) {
  return $tw.wiki.getTiddlerText(baseTitle + title);
}

const titles = [
  'closeBrackets',
  'selectOnOpen',
  'autocompleteIcons',
  'maxRenderedOptions',
  'spellcheck',
  'autocorrect',
  'indentWithTab',
  'bracketMatching',
  'codemirror-vim-mode',
  'completeAnyWord',
  'bracketMatching',
  'lineNumbers',
  'highlightActiveLine',
  'tabSize'
] as const;

type IOptions = (typeof titles)[number];
type IConfig = Record<IOptions, () => string>;

// export const config: Map<IOptions, string | boolean> = new Map();
export const config = {} as IConfig;

titles.forEach((title) => {
  // config.set(title, getConfig(title)!);
  // NOTE: 需要每次重新计算新值，
  config[title] = () => getConfig(title)!;
});
