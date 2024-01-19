import { Completion } from '@codemirror/autocomplete';
import delimiter from '@/cm6/utils/triggerType';
import conf from '@/cm6/cm6';
import { renderTid } from '@/cm6/utils/renderTiddler';
import { menu } from '@/cm6/modules/config/menu';

export function getAllTiddlers(delimiters = delimiter.link) {
  const systemFilter =
    '[all[tiddlers+shadows]!has[draft.of]!prefix[$:/status]!preifx[$:/temp]!prefix[$:/state]!tag[$:/tags/TextEditor/Snippet]!prefix[$:/language]!prefix[$:/config/Server/]!prefix[Draft of]]';
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
        boost: title.startsWith('$') ? 0 : 1,
        // NOTE: TypeError: Cannot set property parentNode of #<Node> which has only a getter, 部分 widget 使用到$tw 的 fakedom api, 会导致报错。
        info: () => renderTid(title),
        apply: (view, completion, from, to) => {
          const cursorEndPosition = from + (delimiters + title).length + 2;
          view.dispatch({
            changes: { from, to, insert: delimiters + title },
            selection: { anchor: cursorEndPosition, head: cursorEndPosition }
          });
        }
      }) as Completion
  );
}
