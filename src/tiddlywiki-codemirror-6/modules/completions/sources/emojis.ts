import { useSound } from '@/cm6/utils/capitalize';
import { Completion } from '@codemirror/autocomplete';

// 部分delimiter不支持修改，所以暂时不抽离出去, 暂时不暴露出配置
const section = 'emojis';
const type = 'cm-emoji';
const delimiter = ':';
const description = 'add emoji';

function snippets() {
  const snippetModules = $tw.modules.types['emoji-snippets'];
  const sources: {
    /** emoji text */
    title: string;
    /** emoji unicode */
    text: string;
  }[] = [];

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
      ({
        label: delimiter + item.title,
        displayLabel: item.title,
        detail: item.text,
        type: 'cm-emoji',
        section,
        apply: (view, completion, from, to) => {
          useSound();
          // const cursorEndPosition = from + item.text.length;
          view.dispatch({
            changes: { from, to, insert: item.text }
            // selection: { anchor: cursorEndPosition, head: cursorEndPosition }
          });
        }
      }) as Completion
  );
}

export default {
  section,
  type,
  delimiter,
  description,
  snippets
};
