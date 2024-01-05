// @ts-nocheck

import { snippetCompletion as snip } from '@codemirror/autocomplete';
import triggerType from '../utils/triggerType';
import cmeConfig from '../cmeConfig';

function getImageSnippets() {
  const allImageTiddlers = $tw.wiki.filterTiddlers('[!is[system]is[image]]');
  return allImageTiddlers.map((title) => ({
    label: `[img[${title}`,
    displayLabel: title,
    type: 'cm-image'
  }));
}

function getAllUserSnippets() {
  const userSnippetTiddlers = $tw.wiki.filterTiddlers(
    '[all[shadows+system+tiddlers]tag[$:/tags/TextEditor/Snippet]!has[draft.of]]'
  );

  const allInfo = userSnippetTiddlers.map((title) => {
    const { caption = '', text = '' } = $tw.wiki.getTiddler(title)?.fields!;
    return {
      title: title.split('/').pop()!,
      text: text.trim(),
      caption
    };
  });

  return allInfo.map((info) =>
    snip(`${info.text}`, {
      label: '/' + (info.caption as string) || '/' + info.title,
      displayLabel: (info.caption as string) || info.title,
      type: 'cm-snippet', // class: cm-completionIcon-cm-snippets
      apply: info.text,
      info: info.text
    })
  );
}

function getAllWidgetSnippets() {
  const modules = $tw.modules.titles;
  if (!modules) return [];
  const allwidgets = Object.entries(modules)
    .filter(
      ([_, { moduleType, exports }]) =>
        moduleType === 'widget' && exports && Object.keys(exports).length > 0
    )
    .map(([_, { exports }]) => Object.keys(exports)[0]);

  // https://github.com/codemirror/website/tree/master/site/examples/autocompletion
  // https://codemirror.net/docs/ref/#autocomplete
  return allwidgets.map((widget) =>
    snip(`<\$${widget} \$\{0\}/>\$\{1\}`, {
      label: `<\$${widget}`,
      displayLabel: widget,
      type: 'keyword'
      // section: 'widgets'// 分组，类似 selection option group
      // detail: 'widget',
      // info: `<\$${widget} />`
    })
  );
}

function getAllTiddlers(delimiters = triggerType.doubleBrackets) {
  const systemFilter =
    '[all[tiddlers+shadows]!has[draft.of]!prefix[$:/status]!preifx[$:/temp]!prefix[$:/state]!tag[$:/tags/TextEditor/Snippet]!prefix[$:/language]!prefix[$:/config/Server/]]';
  const filter = cmeConfig.enableSystemTiddlersCompletion()
    ? systemFilter
    : '[!is[system]]';
  const allTiddlers = $tw.wiki.filterTiddlers(filter);

  return allTiddlers.map((title) => ({
    label: delimiters + title,
    displayLabel: title.length > 35 ? title.slice(0, 35) + ' …' : title,
    type: 'cm-tiddler',
    info: title
  }));
}

export default {
  imageSnippets: getImageSnippets,
  userSnippets: getAllUserSnippets,
  widgetSnippets: getAllWidgetSnippets,
  linkSnippets: getAllTiddlers,
  embedSnippets: () => getAllTiddlers(triggerType.doublecurlyBrackets)
};
