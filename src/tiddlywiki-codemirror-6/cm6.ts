const baseTitle = '$:/config/codemirror-6/';

function isNumeric(str: string) {
  return /^\d+$/.test(str);
}

// https://github.com/Jermolene/TiddlyWiki5/blob/master/plugins/tiddlywiki/codemirror/engine.js
// cm5 plugin use config's type field
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

// TODO: 这些配置如果写成常量，tiddlywiki 将会缓存？??，不会每次重新计算 (不知道为什么), 实例仅仅创建了一次？??，但是为什么做成 function, 重新在实例里面计算又可以了？??
// NOTE: 对应配置的 caption 不要写成 TxxxBxxx 格式。
export const tiddlers = {
  inlineSuggestion: {
    caption: 'inline suggestion(experimental)',
    description: 'inline suggestion(experimental)'
  },
  tiddlerPreview: {
    caption: 'tiddler preview',
    description: 'tiddler preview'
  },
  snippetPreview: {
    caption: 'snippet preview',
    description: 'snippet preview'
  },
  linkPreview: {
    caption: 'link preview',
    description: 'link preview'
  },
  fontsize: {
    caption: 'font size',
    description: 'font size'
  },
  enableMarkdownJsHighlight: {
    caption: 'enable Markdown JS highlight',
    description: 'enabling Markdown JS highlight'
  },
  enableWordCount: {
    caption: 'enable word count',
    description: 'enabling word count'
  },
  highlightWhitespace: {
    caption: 'highlight whitespace',
    description: 'highlighting whitespace'
  },
  highlightTrailingWhitespace: {
    caption: 'highlight trailing whitespace',
    description: 'highlighting trailing whitespace'
  },
  enableSystemTiddlersCompletion: {
    caption: 'enable system tiddlers completion',
    description: 'enabling system tiddlers completion'
  },
  closeOnBlur: {
    caption: 'close on blur',
    description: 'closing on blur'
  },
  foldGutter: {
    caption: 'fold gutter',
    description: 'fold gutter'
  },
  enableOneDarkTheme: {
    caption: 'enable One Dark theme',
    description: 'enabling One Dark theme'
  },
  'clickable-icon': {
    caption: 'clickable icon',
    description: 'clickable icon'
  },
  clickable: {
    caption: 'clickable',
    description: 'clickable'
  },
  customPlaceholder: {
    caption: 'custom placeholder',
    description: 'custom placeholder'
  },
  placeholder: {
    caption: 'placeholder',
    description: 'placeholder'
  },
  cursorBlinkRate: {
    caption: 'cursor blink rate',
    description: 'cursor blink rate'
  },
  minLength: {
    caption: 'min length',
    description: 'min length'
  },
  delimiter: {
    caption: 'delimiter',
    description: 'delimiter'
  },
  minimap: {
    caption: 'minimap',
    description: 'minimap'
  },
  closeBrackets: {
    caption: 'close brackets',
    description: 'closing brackets'
  },
  selectOnOpen: {
    caption: 'select on open',
    description: 'selecting on open'
  },
  autocompleteIcons: {
    caption: 'autocomplete icons',
    description: 'autocomplete icons'
  },
  maxRenderedOptions: {
    caption: 'max rendered options',
    description: 'max rendered options'
  },
  spellcheck: {
    caption: 'spellcheck',
    description: 'spellcheck'
  },
  autocorrect: {
    caption: 'autocorrect',
    description: 'autocorrect'
  },
  indentWithTab: {
    caption: 'indent with tab',
    description: 'indenting with tab'
  },
  bracketMatching: {
    caption: 'bracket matching',
    description: 'bracket matching'
  },
  vimmode: {
    caption: 'Vim mode',
    description: 'Vim mode'
  },
  completeAnyWord: {
    caption: 'complete any word',
    description: 'completing any word'
  },
  lineNumbers: {
    caption: 'line numbers',
    description: 'line numbers'
  },
  highlightActiveLine: {
    caption: 'highlight active line',
    description: 'highlighting active line'
  },
  tabSize: {
    caption: 'tab size',
    description: 'tab size'
  },
  activateOnTyping: {
    caption: 'activate on typing',
    description: 'activating on typing'
  }
};

type IOptions = keyof typeof tiddlers;

type IConfig = Record<IOptions, () => any>;

const cm6 = {} as IConfig;
const options = Object.keys(tiddlers) as IOptions[];

options.forEach((key: IOptions) => {
  cm6[key] = () => getConfig(key) as any;
});

export default cm6;
