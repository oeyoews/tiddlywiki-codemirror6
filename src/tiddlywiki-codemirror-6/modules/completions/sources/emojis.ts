import { Completion } from '@codemirror/autocomplete';
import delimiter from '@/cm6/modules/constants/triggerType';
import { menu } from '@/cm6/modules/constants/menu';

export function emojiSnippets() {
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
        label: delimiter.emoji + item.title,
        displayLabel: item.title,
        detail: item.text,
        type: 'cm-emoji',
        section: menu.emojis,
        apply: (view, completion, from, to) => {
          // const cursorEndPosition = from + item.text.length;
          view.dispatch({
            changes: { from, to, insert: item.text }
            // selection: { anchor: cursorEndPosition, head: cursorEndPosition }
          });
        }
      }) as Completion
  );
}
