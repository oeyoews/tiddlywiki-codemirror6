const baseTitle = '$:/config/codemirror-6/';

function isNumeric(str: string) {
  return /^\d+$/.test(str);
}
function getConfig(title: string) {
  const config = $tw.wiki.getTiddlerText(baseTitle + title);
  if (config === 'yes') {
    return true;
  } else if (config === 'no') {
    return false;
  } else if (isNumeric(config!)) {
    return Number(config);
  }
  return config;
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
  'tabSize',
  'activateOnTyping'
] as const;

type IOptions = (typeof titles)[number];
type IConfig = Record<IOptions, () => any>;

// export const config: Map<IOptions, string | boolean> = new Map();
const config = {} as IConfig;

titles.forEach((title) => {
  // config.set(title, getConfig(title)!);
  // NOTE: 需要每次重新计算新值，
  config[title] = () => getConfig(title)!;
});

export default config;
