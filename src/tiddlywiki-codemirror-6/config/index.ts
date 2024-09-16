import { isNumeric } from '../utils/numeric';

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

type ITiddlerConfig = {
  caption: {
    zh: string;
    en: string;
  };
  text?: string | number;
  icon?: string;
  description?: {
    zh: string;
    en: string;
  };
};

// 泛型函数, 用于推导类型: IMode, 和 ITiddlerConfig
function defineConfig<T extends Object, K extends keyof T>(
  config: Record<K, ITiddlerConfig>
) {
  return config;
}

// #region tiddlers
export const tiddlers = defineConfig({
  insertModeFirst: {
    caption: {
      zh: 'VIM自动进入插入模式',
      en: 'Insert Mode Auto Firstly'
    },
    text: 'no'
  },
  EditorHeight: {
    caption: {
      zh: '最大高度',
      en: 'Max Height'
    },
    text: ''
  },
  lines: {
    caption: {
      zh: '行数',
      en: 'Lines'
    },
    text: 1
  },
  todobox: {
    caption: {
      zh: '代办事项复选框',
      en: 'Task checkbox'
    }
  },
  checkbox: {
    caption: {
      zh: '复选框',
      en: 'Checkbox'
    }
  },
  foldByIndent: {
    caption: {
      zh: '按缩进折叠',
      en: 'Fold By Indent'
    }
  },
  removeOutline: {
    text: 'yes',
    caption: {
      en: 'remove editor outline',
      zh: '移除编辑器边框'
    }
  },
  disableCM6: {
    caption: {
      en: '@depreacted: use simeple editor(Need Restart, Experimental, Not Recommended)',
      zh: '@弃用 使用简单编辑器 (需要重启，实验性，不建议使用)'
    }
  },
  vimJK: {
    caption: {
      zh: 'vim 键盘映射 JK(你知道我在说什么.)',
      en: "vim keyboard mapping JK(You know what I'm saying.)"
    }
  },
  matchText: {
    caption: {
      zh: '匹配文本',
      en: 'Match Text'
    }
  },
  commentComplete: {
    caption: {
      zh: '注释中开启补全',
      en: 'Comment Complete'
    },
    description: {
      zh: '注释中开启补全',
      en: 'Comment Complete'
    }
  },
  footer: {
    caption: {
      zh: '页脚',
      en: 'Footer'
    },
    icon: '📝',
    description: {
      zh: '显示代码片段来源',
      en: 'Show snippets footer'
    }
  },
  debug: {
    caption: {
      zh: '调试',
      en: 'Debug'
    },
    icon: '🐞',
    description: {
      zh: '在控制台上显示 codemirror6 的日志',
      en: 'Sebug for codemirror on console'
    }
  },
  activateOnTyping: {
    caption: {
      zh: '打字激活',
      en: 'Activate on Typing'
    },
    text: 'yes',
    icon: '🚀',
    description: {
      zh: '启用打字激活弹出补全框，关闭后，可以 ctrl+space 手动触发',
      en: 'Enable activation on typing for enhanced functionality.'
    }
  },
  inlineSuggestion: {
    caption: {
      zh: '内联建议（实验性）',
      en: 'Inline Suggestion (Experimental)'
    },
    icon: '🔍',
    description: {
      zh: '内联建议的实验性功能。',
      en: 'Experimental feature for inline suggestions.'
    }
  },
  tiddlerPreview: {
    caption: {
      zh: 'Tiddler 预览',
      en: 'Tiddler Preview'
    },
    icon: '📑',
    description: {
      zh: '启用 tiddlers 的预览。',
      en: 'Enable preview for tiddlers.'
    }
  },
  snippetPreview: {
    caption: {
      zh: '代码片段预览',
      en: 'Snippet Preview'
    },
    icon: '📝',
    description: {
      zh: '启用代码片段的预览。',
      en: 'Enable preview for code snippets.'
    }
  },
  linkPreview: {
    caption: {
      zh: '链接预览',
      en: 'Link Preview'
    },
    icon: '🔗',
    description: {
      zh: '启用超链接的预览。',
      en: 'Enable preview for hyperlinks.'
    }
  },
  // TODO: support placehodler to show default font
  fontFamily: {
    caption: {
      zh: '字体',
      en: 'Font Family'
    },
    text: '',
    icon: '📂',
    description: {
      zh: '设置字体以提高可读性。',
      en: 'Set the font family for better readability.'
    }
  },
  fontsize: {
    caption: {
      zh: '字体大小',
      en: 'Font Size'
    },
    text: '16px',
    icon: '📏',
    description: {
      zh: '设置字体大小以提高可读性。',
      en: 'Set the font size for better readability.'
    }
  },
  wordCount: {
    caption: {
      zh: '启用字数统计',
      en: 'Enable Word Count'
    },
    icon: '📊',
    description: {
      zh: '显示内容的字数统计。',
      en: 'Display the word count for the content.'
    }
  },
  whitespace: {
    caption: {
      zh: '高亮空格',
      en: 'Highlight Whitespace'
    },
    icon: '🔍',
    description: {
      zh: '启用空格的高亮显示。',
      en: 'Enable highlighting of whitespace.'
    }
  },
  highlightTrailingWhitespace: {
    caption: {
      zh: '高亮尾随空格',
      en: 'Highlight Trailing Whitespace'
    },
    icon: '🔍',
    description: {
      zh: '启用尾随空格的高亮显示。',
      en: 'Enable highlighting of trailing whitespace.'
    }
  },
  enableSystemTiddlersCompletion: {
    caption: {
      zh: '启用系统 Tiddlers 完成',
      en: 'Enable System Tiddlers Completion'
    },
    icon: '🔄',
    description: {
      zh: '启用系统 Tiddlers 的自动完成。',
      en: 'Enable completion for system tiddlers.'
    }
  },
  closeOnBlur: {
    caption: {
      zh: '失焦关闭',
      en: 'Close on Blur'
    },
    text: 'yes',
    icon: '🔒',
    description: {
      zh: '失焦时自动关闭。',
      en: 'Automatically close on blur.'
    }
  },
  foldGutter: {
    caption: {
      zh: '折叠',
      en: 'Fold Gutter'
    },
    icon: '📂',
    description: {
      zh: '为代码启用折叠。',
      en: 'Enable folding gutter for code.'
    }
  },
  translate: {
    caption: {
      zh: '翻译',
      en: 'Translate'
    },
    icon: '🌐',
    description: {
      zh: '启用翻译',
      en: 'Enable translation.'
    }
  },
  rtl: {
    caption: {
      zh: 'RTL',
      en: 'RTL'
    },
    icon: '↔️',
    description: {
      zh: '启用从右到左的文本方向。',
      en: 'Enable Right-to-Left text direction.'
    }
  },
  'cursor-thickness': {
    caption: {
      zh: '光标厚度',
      en: 'Cursor Thickness'
    },
    text: '1px',
    icon: '🚸',
    description: {
      zh: '设置光标的宽度',
      en: 'Set the thickness of the cursor.'
    }
  },
  onedark: {
    caption: {
      zh: '启用 One Dark 主题',
      en: 'Enable One Dark Theme'
    },
    text: 'yes',
    icon: '🌒',
    description: {
      zh: '启用 One Dark 主题。',
      en: 'Enable the One Dark theme.'
    }
  },
  'clickable-icon': {
    caption: {
      zh: '可点击图标',
      en: 'Clickable Icon'
    },
    text: '🐟',
    icon: '🖱️',
    description: {
      zh: '设置一个可点击的图标。',
      en: 'Set a clickable icon.'
    }
  },
  clickable: {
    caption: {
      zh: '可点击',
      en: 'Clickable'
    },
    icon: '🖱️',
    description: {
      zh: '启用可点击性。',
      en: 'Enable clickability.'
    }
  },
  customPlaceholder: {
    caption: {
      zh: '自定义占位符',
      en: 'Custom Placeholder'
    },
    icon: '🖊️',
    description: {
      zh: '设置自定义占位符。',
      en: 'Set a custom placeholder.'
    }
  },
  placeholder: {
    caption: {
      zh: '占位符',
      en: 'Placeholder'
    },
    text: '✨ Write something ✒️ ...',
    icon: '✏️️',
    description: {
      zh: '设置默认的占位符文本。',
      en: 'Set the default placeholder text.'
    }
  },
  cursorBlinkRate: {
    caption: {
      zh: '光标闪烁速率',
      en: 'Cursor Blink Rate'
    },
    text: 1000,
    icon: '⚡',
    description: {
      zh: '设置光标闪烁的速率（以毫秒为单位）,设置为 0 禁用闪烁',
      en: 'Set the rate at which the cursor blinks (in milliseconds).'
    }
  },
  minLength: {
    caption: {
      zh: '最小长度',
      en: 'Min Length'
    },
    text: 1,
    icon: '📏',
    description: {
      zh: '设置自动补全最小长度。1 为立刻触发',
      en: 'Set the minimum length for input.'
    }
  },
  delimiter: {
    caption: {
      zh: '分隔符',
      en: 'Delimiter'
    },
    text: '/',
    icon: '🔍',
    description: {
      zh: '设置某些操作的分隔符。',
      en: 'Set the delimiter for certain operations.'
    }
  },
  minimap: {
    caption: {
      zh: '小地图',
      en: 'Minimap'
    },
    icon: '🗺️',
    description: {
      zh: '启用导航的小地图。',
      en: 'Enable a minimap for navigation.'
    }
  },
  minimapAudoHide: {
    caption: {
      zh: '小地图自动隐藏',
      en: 'Minimap autohide'
    },
    icon: '🗺️',
    description: {
      zh: '自动隐藏小地图',
      en: 'Automatically hide minimap'
    }
  },
  closeBrackets: {
    caption: {
      zh: '自动关闭括号',
      en: 'Close Brackets'
    },
    text: 'yes',
    icon: '🔄',
    description: {
      zh: '自动关闭括号。',
      en: 'Automatically close brackets.'
    }
  },
  selectOnOpen: {
    caption: {
      zh: '自动选择补全项',
      en: 'Select on Open'
    },
    text: 'yes',
    icon: '🔄',
    description: {
      zh: '自动选择补全项',
      en: 'Automatically select on open.'
    }
  },
  autocompleteIcons: {
    caption: {
      zh: '自动完成图标',
      en: 'Autocomplete Icons'
    },
    text: 'yes',
    icon: '🎨',
    description: {
      zh: '在自动完成建议中启用图标。',
      en: 'Enable icons in autocomplete suggestions.'
    }
  },
  maxRenderedOptions: {
    caption: {
      zh: '最大渲染选项',
      en: 'Max Rendered Options'
    },
    text: 20,
    icon: '🔍',
    description: {
      zh: '设置自动完成中渲染的选项的最大数量。',
      en: 'Set the maximum number of rendered options in autocomplete.'
    }
  },
  spellcheck: {
    caption: {
      zh: '拼写检查',
      en: 'Spellcheck'
    },
    icon: '📝',
    description: {
      zh: '启用拼写检查。',
      en: 'Enable spellchecking.'
    }
  },
  autocorrect: {
    caption: {
      zh: '自动纠正',
      en: 'Autocorrect'
    },
    icon: '🔄',
    description: {
      zh: '启用自动纠正。',
      en: 'Enable autocorrection.'
    }
  },
  indentWithTab: {
    caption: {
      zh: '制表符缩进',
      en: 'Indent with Tab'
    },
    text: 'yes',
    icon: '🔄',
    description: {
      zh: '使用制表符进行缩进，而不是空格。',
      en: 'Indent with tab instead of spaces.'
    }
  },
  bracketMatching: {
    caption: {
      zh: '括号匹配',
      en: 'Bracket Matching'
    },
    text: 'yes',
    icon: '🔄',
    description: {
      zh: '启用括号匹配。',
      en: 'Enable matching of brackets.'
    }
  },
  vimmode: {
    caption: {
      zh: 'Vim 模式',
      en: 'Vim Mode'
    },
    icon: '🎮',
    description: {
      zh: '启用文本编辑的 Vim 模式。',
      en: 'Enable Vim mode for text editing.'
    }
  },
  completeAnyWord: {
    caption: {
      zh: '完成任意单词',
      en: 'Complete Any Word'
    },
    icon: '🔄',
    description: {
      zh: '启用对任意单词的完成。',
      en: 'Enable completion for any word.'
    }
  },
  lineNumbers: {
    caption: {
      zh: '行号',
      en: 'Line Numbers'
    },
    text: 'no',
    icon: '🔢',
    description: {
      zh: '显示行号以便更好地导航代码。',
      en: 'Show line numbers for better code navigation.'
    }
  },
  highlightActiveLine: {
    caption: {
      zh: '高亮活动行',
      en: 'Highlight Active Line'
    },
    text: 'no',
    icon: '🔍',
    description: {
      zh: '高亮活动行以便更好地可见。',
      en: 'Highlight the active line for better visibility.'
    }
  },
  tabSize: {
    caption: {
      zh: '制表符大小',
      en: 'Tab Size'
    },
    text: 2,
    icon: '🔍',
    description: {
      zh: '设置制表符的大小。',
      en: 'Set the size of tabs.'
    }
  }
});

type IConfigOptions = keyof typeof tiddlers;

type IConfig = Record<IConfigOptions, () => any>;

const cm6 = {} as IConfig;
// 类型断言的另外一种写法 as const
const options = <IConfigOptions[]>Object.keys(tiddlers);

options.forEach((key) => {
  cm6[key] = () => getConfig(key);
});

export default cm6;

export const modes = {
  tiddlywiki: 'text/vnd.tiddlywiki',
  markdown: 'text/markdown',
  xmarkdown: 'text/x-markdown',
  json: 'application/json',
  javascript: 'application/javascript',
  css: 'text/css',
  plain: 'text/plain',
  html: 'text/html',
  mermaid: 'text/vnd.tiddlywiki.mermaid',
  svg: 'image/svg+xml'
} as const;

export type IMode = (typeof modes)[keyof typeof modes];

/** notify tiddlers */
const notifierPrefix = '$:/plugins/oeyoews/tiddlywiki-codemirror-6/notify';

const notifier = ['save', 'copy'] as const;

export const notify = {} as Record<(typeof notifier)[number], string>;

notifier.forEach((key) => {
  notify[key] = `${notifierPrefix}/${key}`;
});
