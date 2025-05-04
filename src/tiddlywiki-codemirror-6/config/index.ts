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
  disable?: boolean;
  caption: {
    zh: string;
    en: string;
  };
  'option-names'?: string;
  'option-values'?: string;
  text?: string | number;
  icon?: string;
  category?:
    | 'vim'
    | 'general'
    | 'markdown'
    | 'placeholder'
    | 'completion'
    | 'keymap'
    | 'fold';
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
  useSound: {
    caption: {
      zh: '开启音效',
      en: 'Use Sound'
    },
    text: 'no',
    icon: '🔊',
    description: {
      zh: '由插件 [[oeyoews/neotw-play-sound|https://neotw.vercel.app/#%24%3A%2Fplugins%2Foeyoews%2Fneotw-play-sound]] 提供声音支持, 默认关闭',
      en: 'Use Sound'
    }
  },
  // EditorHeight: {
  //   caption: {
  //     zh: '最大高度',
  //     en: 'Max Height'
  //   },
  //   text: ''
  // },
  // lines: {
  //   caption: {
  //     zh: '自动生成行数',
  //     en: 'Lines font new create tiddler'
  //   },
  //   text: 1,
  //   description: {
  //     zh: '新建tiddler自动生成N行(最大不超过20行)',
  //     en: 'Max Lines(max 20)'
  //   }
  // },
  foldGutter: {
    caption: {
      zh: '折叠按钮图标',
      en: 'Fold Gutter Icon'
    },
    icon: '📂',
    category: 'fold',
    description: {
      zh: '在编辑器行号右侧显示折叠按钮图标',
      en: 'Show fold gutter icon'
    }
  },
  foldByIndent: {
    caption: {
      zh: '按缩进折叠',
      en: 'Fold By Indent'
    },
    category: 'fold'
  },
  // disableCM6: {
  //   caption: {
  //     en: '@depreacted: use simeple editor(Need Restart, Experimental, Not Recommended)',
  //     zh: '@弃用 使用简单编辑器 (需要重启，实验性，不建议使用)'
  //   }
  // },
  lineWrapping: {
    caption: {
      zh: '自动换行',
      en: 'Line Wrapping'
    },
    icon: '↩️',
    text: 'yes',
    description: {
      zh: '自动换行, 建议开启',
      en: 'Line Wrapping'
    }
  },
  keymap: {
    caption: {
      zh: '键位绑定',
      en: 'KeyMap'
    },
    icon: '🎮',
    category: 'keymap',
    text: 'standard',
    'option-names': 'standard vim',
    'option-values': 'standard vim',
    description: {
      zh: '选择编辑器的键位绑定',
      en: 'select editor keymap'
    }
  },
  // vim
  vimmode: {
    disable: true,
    caption: {
      zh: 'Vim 模式',
      en: 'Vim Mode'
    },
    icon: '🎮',
    category: 'vim',
    description: {
      zh: '启用文本编辑的 Vim 模式。',
      en: 'Enable Vim mode for text editing.'
    }
  },
  vimJK: {
    caption: {
      zh: 'Vim JK',
      en: "vim keyboard mapping JK(You know what I'm saying.)"
    },
    icon: '⌨️',
    category: 'vim',
    description: {
      zh: '快速退出插入模式',
      en: 'Fast Exit Insert Mode'
    }
  },
  insertModeFirst: {
    caption: {
      zh: 'VIM自动进入插入模式',
      en: 'Insert Mode Auto Firstly'
    },
    category: 'vim',
    text: 'no',
    description: {
      zh: 'VIM模式下新建tiddler自动进入插入模式',
      en: 'Insert Mode Auto Firstly'
    }
  },
  // matchText: {
  //   caption: {
  //     zh: '匹配文本',
  //     en: 'Match Text'
  //   }
  // },
  commentComplete: {
    disable: true,
    caption: {
      zh: '注释中开启补全',
      en: 'Comment Complete'
    },
    icon: '💬',
    description: {
      zh: '注释中开启补全',
      en: 'Comment Complete'
    }
  },
  debug: {
    disable: true,
    caption: {
      zh: '调试(实验性)',
      en: 'Debug(experimental)'
    },
    icon: '🐞',
    description: {
      zh: '在控制台上显示 codemirror6 的日志',
      en: 'Sebug for codemirror on console'
    }
  },
  activateOnTyping: {
    caption: {
      zh: '开启自动补全',
      en: 'Activate on Typing'
    },
    text: 'yes',
    icon: '🚀',
    description: {
      zh: '关闭后，可以 <kbd>CTRL+SPACE</kbd> 手动触发',
      en: 'Enable activation on typing for enhanced functionality.'
    }
  },
  inlineSuggestion: {
    disable: false,
    caption: {
      zh: '内联建议（实验性）',
      en: 'Inline Suggestion (Experimental)'
    },
    text: 'yes',
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
      zh: '/ 预览文本',
      en: 'Snippet Preview'
    },
    icon: '📝',
    description: {
      zh: '启用 `/` 代码片段的预览。',
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
      zh: '启用超链接预览。',
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
    icon: '🅰️',
    description: {
      zh: '设置编辑器字体',
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
      zh: '设置编辑器字体大小',
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
  highlightNewLine: {
    caption: {
      zh: '高亮换行符',
      en: 'Highlight newline'
    },
    icon: '↵',
    description: {
      zh: '高亮换行符号',
      en: 'support highlight newline'
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
  closeOnBlur: {
    caption: {
      zh: '失焦关闭',
      en: 'Close on Blur'
    },
    text: 'yes',
    icon: '🔒',
    description: {
      zh: '光标不在编辑区域时， 自动隐藏自动补全弹窗',
      en: 'Automatically close on blur.'
    }
  },
  // translate: {
  //   caption: {
  //     zh: '翻译',
  //     en: 'Translate'
  //   },
  //   icon: '🌐',
  //   description: {
  //     zh: '启用翻译',
  //     en: 'Enable translation.'
  //   }
  // },
  onedark: {
    caption: {
      zh: '黑暗模式下启用编辑器黑暗样式',
      en: 'Enable One Dark Theme'
    },
    text: 'yes',
    icon: '🌒',
    description: {
      zh: '黑暗模式下启用编辑器黑暗样式',
      en: 'Enable the One Dark theme.'
    }
  },
  'clickable-icon': {
    caption: {
      zh: '点击图标',
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
      zh: '可以在编辑区域内看到一个可以点击的图标 <kbd>CTRL+click</kbd>',
      en: 'Enable clickability.'
    }
  },
  enableCustomPlaceholder: {
    caption: {
      zh: '启用自定义占位符',
      en: 'Custom Placeholder'
    },
    icon: '✍️',
    category: 'placeholder',
    description: {
      zh: '启用设置自定义占位符。',
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
    category: 'placeholder',
    description: {
      zh: '设置自定义的占位符',
      en: 'Set the default placeholder text.'
    }
  },
  'cursor-thickness': {
    caption: {
      zh: '光标宽度',
      en: 'Cursor Thickness'
    },
    text: '1px',
    icon: '🚸',
    description: {
      zh: '设置光标的宽度',
      en: 'Set the thickness of the cursor.'
    }
  },
  cursorBlinkRate: {
    caption: {
      zh: '光标闪烁速度',
      en: 'Cursor Blink Rate'
    },
    text: 1000,
    icon: '⚡',
    description: {
      zh: '设置光标闪烁的速率（以毫秒为单位）,设置为 0 禁用闪烁',
      en: 'Set the rate at which the cursor blinks (in milliseconds).'
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
      zh: '显示代码片段(注意不要设置和其他的触发符号相同导致冲突, 配置生效需要__重启__tiddlywiki)',
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
      zh: '启用右侧小地图',
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
  // spellcheck: {
  //   caption: {
  //     zh: '拼写检查',
  //     en: 'Spellcheck'
  //   },
  //   icon: '📝',
  //   description: {
  //     zh: '启用拼写检查。',
  //     en: 'Enable spellchecking.'
  //   }
  // },
  // autocorrect: {
  //   caption: {
  //     zh: '自动纠正',
  //     en: 'Autocorrect'
  //   },
  //   icon: '🔄',
  //   description: {
  //     zh: '启用自动纠正。',
  //     en: 'Enable autocorrection.'
  //   }
  // },
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
  },
  bracketMatching: {
    caption: {
      zh: '括号匹配',
      en: 'Bracket Matching'
    },
    text: 'no',
    icon: '🔄',
    description: {
      zh: '启用括号匹配。',
      en: 'Enable matching of brackets.'
    }
  },
  autocompleteIcons: {
    caption: {
      zh: '自动完成图标',
      en: 'Autocomplete Icons'
    },
    category: 'completion',
    text: 'yes',
    icon: '🎨',
    description: {
      zh: '在自动完成建议中启用图标。',
      en: 'Enable icons in autocomplete suggestions.'
    }
  },
  footer: {
    caption: {
      zh: '页脚',
      en: 'Footer'
    },
    category: 'completion',
    icon: '📜',
    description: {
      zh: '显示代码片段来源',
      en: 'Show snippets footer'
    }
  },
  minLength: {
    caption: {
      zh: '最小自动补全检测长度',
      en: 'Min Length'
    },
    category: 'completion',
    text: 1,
    icon: '📏',
    description: {
      zh: '设置自动补全最小长度。1为立刻触发, 一般不建议修改',
      en: 'Set the minimum length for input.'
    }
  },
  selectOnOpen: {
    caption: {
      zh: '自动选中当前补全项',
      en: 'Select on Open'
    },
    text: 'yes',
    category: 'completion',
    icon: '🔄',
    description: {
      zh: '自动选中当前补全项进行补全',
      en: 'Automatically select on open.'
    }
  },
  completeAnyWord: {
    caption: {
      zh: '单词补全',
      en: 'Complete Any Word'
    },
    category: 'completion',
    icon: '🔄',
    description: {
      zh: '如果当前编辑区域有重复输入的单词，重复输入时会提示',
      en: 'Enable completion for any word.'
    }
  },
  enableSystemTiddlersCompletion: {
    caption: {
      zh: '启用系统 Tiddlers 完成',
      en: 'Enable System Tiddlers Completion'
    },
    icon: '🔄',
    category: 'completion',
    description: {
      zh: '更多关于系统条目标题的补全提示',
      en: 'Enable completion for system tiddlers.'
    }
  },
  maxRenderedOptions: {
    caption: {
      zh: '自动补全每页数量',
      en: 'Max Rendered Options'
    },
    category: 'completion',
    text: 20,
    icon: '🔢',
    description: {
      zh: '设置自动完成中渲染的选项的最大数量',
      en: 'Set the maximum number of rendered options in autocomplete.'
    }
  },
  lineNumbers: {
    caption: {
      zh: '行号',
      en: 'Line Numbers'
    },
    text: 'yes',
    icon: '🔢',
    description: {
      zh: '开启行号',
      en: 'Show line numbers for better code navigation.'
    }
  },
  highlightActiveLine: {
    caption: {
      zh: '高亮当前行',
      en: 'Highlight Active Line'
    },
    text: 'yes',
    icon: '🔍',
    description: {
      zh: '高亮光标所在行',
      en: 'Highlight the active line for better visibility.'
    }
  },
  // search
  searchPosition: {
    caption: {
      zh: '搜索面板位置',
      en: 'Search Position'
    },
    'option-names': 'top bottom',
    'option-values': 'top bottom',
    text: 'top',
    icon: '🔍',
    description: {
      zh: '搜索面板位置, 默认在顶部',
      en: 'Search Position'
    }
  },
  enableTWMode: {
    caption: {
      zh: 'wikitext 语法高亮（实验性）',
      en: 'wikitext systax highlight （experimental）'
    },
    text: 'yes',
    icon: '',
    description: {
      zh: 'wikitext 语法高亮（实验性)',
      en: 'wikitexttw systax highlight （experimental）'
    }
  },
  todobox: {
    icon: '☑️',
    caption: {
      zh: '代办事项复选框(MD)',
      en: 'Task checkbox'
    }
  },
  checkbox: {
    disable: true,
    icon: '☑️',
    caption: {
      zh: '复选框(JS)',
      en: 'Checkbox'
    },
    description: {
      zh: '适用于tiddler类型为javascript, 用于切换常量的布尔值, 普通用户建议关闭',
      en: 'Checkbox'
    }
  },
  rtl: {
    caption: {
      zh: 'RTL',
      en: 'RTL'
    },
    icon: '↔️',
    description: {
      zh: '启用从右到左的文本方向(中文不建议开启)',
      en: 'Enable Right-to-Left text direction.'
    }
  },
  removeOutline: {
    icon: '🚫',
    text: 'yes',
    caption: {
      en: 'remove editor outline',
      zh: '移除编辑器边框'
    },
    description: {
      en: 'remove editor outline',
      zh: '移除编辑器边框(配置待修复, 更改配置无效， 默认是移除)'
    }
  },
  chineseEmbed: {
    caption: {
      zh: '[[ 支持中文 【【',
      en: '[[ Support Chinese 【【'
    },
    text: 'no',
    description: {
      zh: '支持中文符号【【(需要重启)',
      en: 'Support Chinese 【【'
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
