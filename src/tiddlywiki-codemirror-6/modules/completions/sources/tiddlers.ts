import { Completion } from '@codemirror/autocomplete';
import delimiter, {
  ITriggerTypeChar
} from '@/cm6/modules/constants/triggerType';
import conf from '@/cm6/config';
import { renderTid } from '@/cm6/utils/renderTiddler';
import { menu } from '@/cm6/modules/constants/menu';
import { EditorView } from '@codemirror/view';

export function getAllTiddlers(delimiters: ITriggerTypeChar = delimiter.link) {
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
        apply: (view: EditorView, completion, from, to) => {
          const doc = view.state.doc;
          let cursorEndPosition: number = from;
          const cursorPos = view.state.selection.main.head;
          if (cursorPos + delimiters.length <= doc.length) {
            cursorEndPosition =
              cursorEndPosition + title.length + delimiters.length * 2;
          } else {
            cursorEndPosition += (title + delimiters).length;
          }
          view.dispatch({
            changes: { from, to, insert: delimiters + title },
            selection: { anchor: cursorEndPosition, head: cursorEndPosition }
          });
        }
      }) as Completion
  );
}
