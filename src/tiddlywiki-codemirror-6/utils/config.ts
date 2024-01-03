const baseTitle = '$:/config/codemirror-6/';

function isNumeric(str: string) {
  return /^\d+$/.test(str);
}

// https://github.com/Jermolene/TiddlyWiki5/blob/master/plugins/tiddlywiki/codemirror/engine.js
// cm5 是手动加了一个 type，判断类型
function getConfig(title: string) {
  const config = $tw.wiki.getTiddlerText(baseTitle + title)?.trim();
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
  'enableOneDarkTheme',
  'clickable-icon',
  'clickable',
  'placeholder',
  'cursorBlinkRate',
  'minLength',
  'delimiter',
  'minimap',
  'closeBrackets',
  'selectOnOpen',
  'autocompleteIcons',
  'maxRenderedOptions',
  'spellcheck',
  'autocorrect',
  'indentWithTab',
  'bracketMatching',
  'vimmode',
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
  // NOTE: 需要每次重新计算新值，
  // config.set(title, getConfig(title)!);
  config[title] = () => getConfig(title)!;
});

export default config;
