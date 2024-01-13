import { Completion } from '@codemirror/autocomplete';
import { snippetCompletion as snip } from '@codemirror/autocomplete';
import { ISource } from 'src/tiddlywiki-codemirror-6/types';
import delimiter from 'src/tiddlywiki-codemirror-6/utils/triggerType';
import { menu } from 'src/tiddlywiki-codemirror-6/modules/config/menu';

export function emojiSnippets() {
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
        displayLabel: item.text,
        detail: item.title,
        type: 'cm-emoji',
        section: menu.emojis
      }) as Completion
  );
}
