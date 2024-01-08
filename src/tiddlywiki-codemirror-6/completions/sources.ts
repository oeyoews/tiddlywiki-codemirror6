import { usersnippets, words } from '../completions/snippets';
import { snippetCompletion as snip } from '@codemirror/autocomplete';
import triggerType from '../utils/triggerType';
import cmeConfig from '../cmeConfig';
import type { IInfo } from '../types';

// 如果不对 label 进行特殊处理，就要处理光标位置，自定义 app function, 灵活性较差 https://github.com/BurningTreeC/tiddlywiki-codemirror-6/blob/6ed53e8624b12cf2c09187f4f5fdcdd5960889c3/plugins/tiddlywiki-codemirror-6/engine.js#L327-L346C3
function getImageSnippets() {
  const allImageTiddlers = $tw.wiki.filterTiddlers(
    '[!is[system]is[image]]  [all[tiddlers+shadows]tag[$:/tags/Image]]'
  );

  return allImageTiddlers.map((title) => ({
    label: `[img[${title}`,
    displayLabel: title,
    type: 'cm-image',
    info: () => {
      const imagePreview = document.createElement('div');
      imagePreview.className = 'cm-image-preview';
      const imageHTML = $tw.wiki.renderTiddler('text/html', title, {
        // parseAsInline: true
      });
      imagePreview.innerHTML = imageHTML;
      return imagePreview;
    }
  }));
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
  const allInfo: IInfo[] = [];

  if (snippetModules) {
    const req = Object.getOwnPropertyNames(snippetModules);

    if (req) {
      if ($tw.utils.isArray(req)) {
        req.forEach((item) => {
          allInfo.push(...require(item));
        });
      } else {
        // @ts-ignore
        allInfo.push(...require(req));
      }
    }
  }

  return allInfo.map((info) =>
    snip(info.text, {
      label: ':' + cmeConfig.delimiter() + info.title,
      displayLabel: info.title,
      type: 'cm-emoji',
      info: info.text
    })
  );
}

function getAllUserSnippets() {
  const userSnippetTiddlers = $tw.wiki.filterTiddlers(
    '[all[shadows+system+tiddlers]tag[$:/tags/TextEditor/Snippet]!has[draft.of]]'
  );

  const allInfo: IInfo[] = userSnippetTiddlers.map((title) => {
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
          allInfo.push(...require(item));
        });
      } else {
        // @ts-ignore
        allInfo.push(...require(req));
      }
    }
  }

  // 加载内置代码片段
  allInfo.push(...usersnippets);

  return allInfo.map((info) =>
    snip(info.text, {
      label: cmeConfig.delimiter() + info.title,
      displayLabel: info.title,
      type: 'cm-snippet', // class: cm-completionIcon-cm-snippets
      info: info.desc || info.text
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
    snip(`<\$${widget} \$\{0\}/>\$\{1\}`, {
      label: `<\$${widget}`,
      displayLabel: widget,
      type: 'cm-widget'
      // section: 'widgets'// 分组，类似 selection option group
      // detail: 'widget',
      // info: `<\$${widget} />`
    })
  );
}

function getAllMacros() {
  // @ts-ignore
  const macros = Object.entries($tw.macros);

  // @ts-ignore
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
      label: triggerType.macro + name,
      displayLabel: name,
      type: 'cm-macro',
      info: paramList
    });
  });
}

function getAllTiddlers(delimiters = triggerType.link) {
  const systemFilter =
    '[all[tiddlers+shadows]!has[draft.of]!prefix[$:/status]!preifx[$:/temp]!prefix[$:/state]!tag[$:/tags/TextEditor/Snippet]!prefix[$:/language]!prefix[$:/config/Server/]]';
  const filter = cmeConfig.enableSystemTiddlersCompletion()
    ? systemFilter
    : '[!is[system]!has[draft.of]]';
  const allTiddlers = $tw.wiki.filterTiddlers(filter);

  return allTiddlers.map((title) => ({
    label: delimiters + title,
    displayLabel: title.length > 35 ? title.slice(0, 35) + ' …' : title,
    type: 'cm-tiddler',
    info: () => {
      const previewNode = $tw.wiki.renderTiddler('text/html', title, {
        // 如果需要解析为 inline 的话，会导致 !! 这种 wikitext 的语法 parse 错误
        // parseAsInline: true
      });
      const preview = document.createElement('div');
      preview.innerHTML = previewNode;
      preview.className = 'cm-image-preview';
      return preview;
    }
  }));
}

export default {
  imageSnippets: getImageSnippets,
  userSnippets: getAllUserSnippets,
  widgetSnippets: getAllWidgetSnippets,
  linkSnippets: getAllTiddlers,
  macroSnippets: getAllMacros,
  embedSnippets: () => getAllTiddlers(triggerType.embed),
  wordsSnippets: getAllWords,
  emojiSnippets: getAllEmojiSnippets
};
