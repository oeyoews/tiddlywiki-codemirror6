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
  footer: {
    caption: 'Footer',
    icon: '📝',
    description: 'Show snippets footer'
  },
  debug: {
    caption: 'Debug',
    icon: '🐞',
    description: 'Sebug for codemirror on console'
  },
  activateOnTyping: {
    caption: 'Activate on Typing',
    text: 'yes',
    icon: '🚀',
    description: 'Enable activation on typing for enhanced functionality.'
  },
  inlineSuggestion: {
    caption: 'Inline Suggestion (Experimental)',
    icon: '🔍',
    description: 'Experimental feature for inline suggestions.'
  },
  tiddlerPreview: {
    caption: 'Tiddler Preview',
    icon: '📑',
    description: 'Enable preview for tiddlers.'
  },
  snippetPreview: {
    caption: 'Snippet Preview',
    icon: '📝',
    description: 'Enable preview for code snippets.'
  },
  linkPreview: {
    caption: 'Link Preview',
    icon: '🔗',
    description: 'Enable preview for hyperlinks.'
  },
  fontsize: {
    caption: 'Font Size',
    text: '16px',
    icon: '📏',
    description: 'Set the font size for better readability.'
  },
  wordCount: {
    caption: 'Enable Word Count',
    icon: '📊',
    description: 'Display the word count for the content.'
  },
  whitespace: {
    caption: 'Highlight Whitespace',
    icon: '🔍',
    description: 'Enable highlighting of whitespace.'
  },
  highlightTrailingWhitespace: {
    caption: 'Highlight Trailing Whitespace',
    icon: '🔍',
    description: 'Enable highlighting of trailing whitespace.'
  },
  enableSystemTiddlersCompletion: {
    caption: 'Enable System Tiddlers Completion',
    icon: '🔄',
    description: 'Enable completion for system tiddlers.'
  },
  closeOnBlur: {
    caption: 'Close on Blur',
    text: 'yes',
    icon: '🔒',
    description: 'Automatically close on blur.'
  },
  foldGutter: {
    caption: 'Fold Gutter',
    icon: '📂',
    description: 'Enable folding gutter for code.'
  },
  translate: {
    caption: 'Translate',
    icon: '🌐',
    description: 'Enable translation.'
  },
  rtl: {
    caption: 'RTL',
    icon: '↔️',
    description: 'Enable Right-to-Left text direction.'
  },
  'cursor-thickness': {
    caption: 'Cursor Thickness',
    text: '1px',
    icon: '🚸',
    description: 'Set the thickness of the cursor.'
  },
  onedark: {
    caption: 'Enable One Dark Theme',
    text: 'yes',
    icon: '🌒',
    description: 'Enable the One Dark theme.'
  },
  'clickable-icon': {
    caption: 'Clickable Icon',
    text: '🐟',
    icon: '🖱️',
    description: 'Set a clickable icon.'
  },
  clickable: {
    caption: 'Clickable',
    icon: '🖱️',
    description: 'Enable clickability.'
  },
  customPlaceholder: {
    caption: 'Custom Placeholder',
    icon: '🖊️',
    description: 'Set a custom placeholder.'
  },
  placeholder: {
    caption: 'Placeholder',
    text: 'Write something ✒️ ...',
    icon: '✏️️',
    description: 'Set the default placeholder text.'
  },
  cursorBlinkRate: {
    caption: 'Cursor Blink Rate',
    text: 1000,
    icon: '⚡',
    description: 'Set the rate at which the cursor blinks (in milliseconds).'
  },
  minLength: {
    caption: 'Min Length',
    text: 3,
    icon: '📏',
    description: 'Set the minimum length for input.'
  },
  delimiter: {
    caption: 'Delimiter',
    text: '/',
    icon: '🔍',
    description: 'Set the delimiter for certain operations.'
  },
  minimap: {
    caption: 'Minimap',
    icon: '🗺️',
    description: 'Enable a minimap for navigation.'
  },
  closeBrackets: {
    caption: 'Close Brackets',
    text: 'yes',
    icon: '🔄',
    description: 'Automatically close brackets.'
  },
  selectOnOpen: {
    caption: 'Select on Open',
    text: 'yes',
    icon: '🔄',
    description: 'Automatically select on open.'
  },
  autocompleteIcons: {
    caption: 'Autocomplete Icons',
    text: 'yes',
    icon: '🎨',
    description: 'Enable icons in autocomplete suggestions.'
  },
  maxRenderedOptions: {
    caption: 'Max Rendered Options',
    text: 20,
    icon: '🔍',
    description: 'Set the maximum number of rendered options in autocomplete.'
  },
  spellcheck: {
    caption: 'Spellcheck',
    icon: '📝',
    description: 'Enable spellchecking.'
  },
  autocorrect: {
    caption: 'Autocorrect',
    icon: '🔄',
    description: 'Enable autocorrection.'
  },
  indentWithTab: {
    caption: 'Indent with Tab',
    text: 'yes',
    icon: '🔄',
    description: 'Indent with tab instead of spaces.'
  },
  bracketMatching: {
    caption: 'Bracket Matching',
    text: 'yes',
    icon: '🔄',
    description: 'Enable matching of brackets.'
  },
  vimmode: {
    caption: 'Vim Mode',
    icon: '🎮',
    description: 'Enable Vim mode for text editing.'
  },
  completeAnyWord: {
    caption: 'Complete Any Word',
    icon: '🔄',
    description: 'Enable completion for any word.'
  },
  lineNumbers: {
    caption: 'Line Numbers',
    text: 'yes',
    icon: '🔢',
    description: 'Show line numbers for better code navigation.'
  },
  highlightActiveLine: {
    caption: 'Highlight Active Line',
    text: 'yes',
    icon: '🔍',
    description: 'Highlight the active line for better visibility.'
  },
  tabSize: {
    caption: 'Tab Size',
    text: 2,
    icon: '🔍',
    description: 'Set the tab size for code indentation.'
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
