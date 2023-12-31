import { usersnippets, words } from '../completions/snippets';
import {
  Completion,
  snippetCompletion as snip
} from '@codemirror/autocomplete';
import delimiter from '../utils/triggerType';
import conf from '../cmeConfig';
import type { ISource } from '../types';

// 如果不对 label 进行特殊处理，就要处理光标位置，自定义 app function, 灵活性较差 https://github.com/BurningTreeC/tiddlywiki-codemirror-6/blob/6ed53e8624b12cf2c09187f4f5fdcdd5960889c3/plugins/tiddlywiki-codemirror-6/engine.js#L327-L346C3
function getImageSnippets() {
  const allImageTiddlers = $tw.wiki.filterTiddlers(
    '[!is[system]is[image]]  [all[tiddlers+shadows]tag[$:/tags/Image]]'
  );

  return allImageTiddlers.map(
    (title) =>
      ({
        label: `[img[${title}`,
        displayLabel: title,
        type: 'cm-image',
        section: 'Images',
        info: () => {
          const imagePreview = document.createElement('div');
          imagePreview.className = 'cm-image-preview';
          const imageHTML = $tw.wiki.renderTiddler('text/html', title, {
            // parseAsInline: true
          });
          imagePreview.innerHTML = imageHTML;
          return imagePreview;
        }
      }) as Completion
  );
}

function getAllWords() {
  return words.map((word) => ({
    label: word,
    displayLabel: word,
    type: 'cm-word'
  }));
}

function getAllEmojiSnippets() {
  const snippetModules = $tw.modules.types['emoji-snippets'];
  const sources: ISource[] = [];

  if (snippetModules) {
    const req = Object.getOwnPropertyNames(snippetModules);

    if (req) {
      if ($tw.utils.isArray(req)) {
        req.forEach((item) => {
          sources.push(...require(item));
        });
      } else {
        // @ts-ignore
        sources.push(...require(req));
      }
    }
  }

  return sources.map(
    (item) =>
      snip(item.text, {
        label: delimiter.emoji + item.title,
        displayLabel: item.title,
        detail: item.text,
        type: 'cm-emoji',
        section: 'Emojis'
      }) as Completion
  );
}

function getAllUserSnippets() {
  const userSnippetTiddlers = $tw.wiki.filterTiddlers(
    '[all[shadows+system+tiddlers]tag[$:/tags/TextEditor/Snippet]!has[draft.of]]'
  );

  const source: ISource[] = userSnippetTiddlers.map((title) => {
    const { caption = '', text = '' } = $tw.wiki.getTiddler(title)?.fields!;

    return {
      title: title.split('/').pop()!,
      text: text.trim(),
      caption
    };
  });

  // 支持加载 snippets 模块 (可以做成外部插件)
  const snippetModules = $tw.modules.types['snippets'];

  if (snippetModules) {
    const req = Object.getOwnPropertyNames(snippetModules);

    if (req) {
      if ($tw.utils.isArray(req)) {
        req.forEach((item) => {
          source.push(...require(item));
        });
      } else {
        // @ts-ignore
        source.push(...require(req));
      }
    }
  }

  // 加载内置代码片段
  source.push(...usersnippets);

  return source.map((info) =>
    snip(info.text, {
      label: conf.delimiter() + info.title,
      displayLabel: info.title,
      type: 'cm-snippet', // class: cm-completionIcon-cm-snippets
      info: info.desc || info.text,
      section: 'Snippets'
    })
  );
}

function getAllWidgetSnippets() {
  // $tw.modules.types 获取不到 widget name, 除非根据文件名
  const modules = $tw.modules.titles;
  if (!modules) return [];
  const allwidgets = Object.entries(modules)
    .filter(
      ([_, { moduleType, exports }]) =>
        moduleType === 'widget' && exports && Object.keys(exports).length > 0
    )
    // @ts-ignore
    .map(([_, { exports }]) => Object.keys(exports)[0]);

  // https://github.com/codemirror/website/tree/master/site/examples/autocompletion
  // https://codemirror.net/docs/ref/#autocomplete
  return allwidgets.map((widget) =>
    snip(delimiter.widget + `${widget} \$\{0\}/>\$\{1\}`, {
      label: delimiter.widget + widget,
      displayLabel: widget,
      type: 'cm-widget',
      section: 'Widgets' // 分组，类似 selection option group
    } as Completion)
  );
}

function getAllMacros() {
  const macros = Object.entries($tw.macros);

  return macros.map(([_, { name, params }]) => {
    const macro =
      params.length > 0
        ? `<<${name} ${params[0].name}="#{1}">>`
        : `<<${name}>>#{1}`;
    const paramList =
      params.length > 0
        ? params.map((p: { name: string }) => p.name).join(', ')
        : 'no parameters';

    return snip(macro, {
      label: delimiter.macro + name,
      displayLabel: name,
      type: 'cm-macro',
      info: paramList,
      section: 'Macros'
    });
  });
}

function getAllTiddlers(delimiters = delimiter.link) {
  const systemFilter =
    '[all[tiddlers+shadows]!has[draft.of]!prefix[$:/status]!preifx[$:/temp]!prefix[$:/state]!tag[$:/tags/TextEditor/Snippet]!prefix[$:/language]!prefix[$:/config/Server/]]';
  const filter = conf.enableSystemTiddlersCompletion()
    ? systemFilter
    : '[!is[system]!has[draft.of]]';
  const allTiddlers = $tw.wiki.filterTiddlers(filter);

  return allTiddlers.map(
    (title) =>
      ({
        label: delimiters + title,
        displayLabel: title.length > 35 ? title.slice(0, 35) + ' …' : title,
        type: 'cm-tiddler',
        section: 'Tiddlers',
        // NOTE: TypeError: Cannot set property parentNode of #<Node> which has only a getter, 部分 widget 使用到$tw 的 fakedom api, 会导致报错。
        info: () => {
          if (!$tw.wiki.getTiddlerText(title)) {
            const titleNode = document.createElement('h2');
            titleNode.innerHTML = title;
            return titleNode;
          }
          const previewNode = $tw.wiki.renderTiddler('text/html', title, {
            // 如果需要解析为 inline 的话，会导致 !! 这种 wikitext 的语法 parse 错误
            // parseAsInline: true
          });
          const preview = document.createElement('div');
          preview.innerHTML = previewNode;
          preview.className = 'cm-image-preview';
          return preview;
        }
      }) as Completion
  );
}

export default {
  imageSnippets: getImageSnippets,
  userSnippets: getAllUserSnippets,
  widgetSnippets: getAllWidgetSnippets,
  linkSnippets: getAllTiddlers,
  macroSnippets: getAllMacros,
  embedSnippets: () => getAllTiddlers(delimiter.embed),
  wordsSnippets: getAllWords,
  emojiSnippets: getAllEmojiSnippets
};
