import { Completion } from '@codemirror/autocomplete';
import conf from '@/cm6/config';
import { renderTid } from '@/cm6/utils/renderTiddler';
import { EditorView } from '@codemirror/view';
import { useSound } from '@/cm6/utils/capitalize';

const type = 'cm-tiddler';
const section = 'tiddlers';
const delimiter = '[[';

export function getAllTiddlers(delimiter: string) {
  const systemFilter =
    '[all[tiddlers+shadows]!has[draft.of]!prefix[$:/status]!preifx[$:/temp]!prefix[$:/state]!tag[$:/tags/TextEditor/Snippet]!prefix[$:/language]!prefix[$:/config/Server/]!prefix[Draft of]]';
  const filter = conf.enableSystemTiddlersCompletion()
    ? systemFilter
    : '[!is[system]!has[draft.of]]';
  const allTiddlers = $tw.wiki.filterTiddlers(filter);

  return allTiddlers.map(
    (title) =>
      ({
        label: delimiter + title,
        displayLabel: title.length > 35 ? title.slice(0, 35) + ' …' : title,
        type,
        section,
        boost: title.startsWith('$') ? 0 : 1,
        // NOTE: TypeError: Cannot set property parentNode of #<Node> which has only a getter, 部分 widget 使用到$tw 的 fakedom api, 会导致报错。
        info: () => renderTid(title),
        // TODO: 自动补全右括号，if right brackets not exist
        apply: (view: EditorView, completion, from, to) => {
          const doc = view.state.doc;
          let cursorEndPosition: number = from;
          const cursorPos = view.state.selection.main.head;
          if (cursorPos + delimiter.length <= doc.length) {
            cursorEndPosition =
              cursorEndPosition + title.length + delimiter.length * 2;
          } else {
            cursorEndPosition += (title + delimiter).length;
          }
          view.dispatch({
            changes: { from, to, insert: delimiter + title },
            selection: { anchor: cursorEndPosition, head: cursorEndPosition }
          });
          useSound();
        }
      }) as Completion
  );
}

export default {
  section,
  type,
  delimiter,
  snippets: () => getAllTiddlers(delimiter)
};
