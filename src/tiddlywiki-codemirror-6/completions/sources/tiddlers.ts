import { Completion } from '@codemirror/autocomplete';
import delimiter from 'src/tiddlywiki-codemirror-6/utils/triggerType';
import conf from 'src/tiddlywiki-codemirror-6/cm6';
import { renderTid } from 'src/tiddlywiki-codemirror-6/utils/renderTiddler';
import { menu } from 'src/tiddlywiki-codemirror-6/modules/config/menu';

export function getAllTiddlers(delimiters = delimiter.link) {
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
        section: menu.tiddlers,
        // NOTE: TypeError: Cannot set property parentNode of #<Node> which has only a getter, 部分 widget 使用到$tw 的 fakedom api, 会导致报错。
        info: () => renderTid(title)
      }) as Completion
  );
}
