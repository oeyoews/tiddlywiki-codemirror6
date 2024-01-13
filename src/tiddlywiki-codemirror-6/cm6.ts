import { isNumeric } from './utils/numeric';

export const configBaseTitle = '$:/config/codemirror-6/';

// https://github.com/Jermolene/TiddlyWiki5/blob/master/plugins/tiddlywiki/codemirror/engine.js
// cm5 plugin use config's type field
function getConfig(title: string) {
  const config = $tw.wiki.getTiddlerText(configBaseTitle + title)?.trim();
  if (config === 'yes') {
    return true;
  } else if (config === 'no') {
    return false;
  } else if (isNumeric(config!)) {
    return Number(config);
  }
  return config;
}

// TODO: 这些配置如果写成常量，tiddlywiki 将会缓存？??，不会每次重新计算 (不知道为什么), 实例仅仅创建了一次？??，但是为什么做成 function, 重新在实例里面计算又可以了？??
// NOTE: 对应配置的 caption 不要写成 TxxxBxxx 格式。
export const tiddlers = {
  activateOnTyping: {
    caption: 'activate on typing',
    text: 'yes'
  },
  inlineSuggestion: {
    caption: 'inline suggestion(experimental)'
  },
  tiddlerPreview: {
    caption: 'tiddler preview'
  },
  snippetPreview: {
    caption: 'snippet preview'
  },
  linkPreview: {
    caption: 'link preview'
  },
  fontsize: {
    caption: 'font size',
    text: '16px'
  },
  wordCount: {
    caption: 'enable word count'
  },
  whitespace: {
    caption: 'highlight whitespace'
  },
  highlightTrailingWhitespace: {
    caption: 'highlight trailing whitespace'
  },
  enableSystemTiddlersCompletion: {
    caption: 'enable system tiddlers completion'
  },
  closeOnBlur: {
    caption: 'close on blur',
    text: 'yes'
  },
  foldGutter: {
    caption: 'fold gutter'
  },
  translate: {
    caption: 'translate'
  },
  rtl: {
    caption: 'RTL'
  },
  'cursor-thickness': {
    caption: 'cursor thickness',
    text: '1px'
  },
  onedark: {
    caption: 'enable One Dark theme',
    text: 'yes'
  },
  'clickable-icon': {
    caption: 'clickable icon',
    text: '🐟'
  },
  clickable: {
    caption: 'clickable'
  },
  customPlaceholder: {
    caption: 'custom placeholder'
  },
  placeholder: {
    caption: 'placeholder',
    text: 'Write something ✒️ ...'
  },
  cursorBlinkRate: {
    caption: 'cursor blink rate',
    text: 1000
  },
  minLength: {
    caption: 'min length',
    text: 3
  },
  delimiter: {
    caption: 'delimiter',
    text: '/'
  },
  minimap: {
    caption: 'minimap'
  },
  closeBrackets: {
    caption: 'close brackets',
    text: 'yes'
  },
  selectOnOpen: {
    caption: 'select on open',
    text: 'yes'
  },
  autocompleteIcons: {
    caption: 'autocomplete icons',
    text: 'yes'
  },
  maxRenderedOptions: {
    caption: 'max rendered options',
    text: 20
  },
  spellcheck: {
    caption: 'spellcheck'
  },
  autocorrect: {
    caption: 'autocorrect'
  },
  indentWithTab: {
    caption: 'indent with tab',
    text: 'yes'
  },
  bracketMatching: {
    caption: 'bracket matching',
    text: 'yes'
  },
  vimmode: {
    caption: 'Vim mode'
  },
  completeAnyWord: {
    caption: 'complete any word'
  },
  lineNumbers: {
    caption: 'line numbers',
    text: 'yes'
  },
  highlightActiveLine: {
    caption: 'highlight active line',
    text: 'yes'
  },
  tabSize: {
    caption: 'tab size',
    text: 2
  }
};

type IConfigOptions = keyof typeof tiddlers;

type IConfig = Record<IConfigOptions, () => any>;

const cm6 = {} as IConfig;
const options = Object.keys(tiddlers) as IConfigOptions[];

options.forEach((key: IConfigOptions) => {
  cm6[key] = () => getConfig(key) as any;
});

export default cm6;
