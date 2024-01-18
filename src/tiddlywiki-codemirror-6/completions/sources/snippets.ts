import { renderTid } from 'src/tiddlywiki-codemirror-6/utils/renderTiddler';
import { snippetCompletion as snip } from '@codemirror/autocomplete';
import { ISource } from 'src/tiddlywiki-codemirror-6/types';
import { menu } from 'src/tiddlywiki-codemirror-6/modules/config/menu';
import conf from 'src/tiddlywiki-codemirror-6/cm6';
import { usersnippets } from '../snippets';

export function userSnippets() {
  const userSnippetTiddlers = $tw.wiki.filterTiddlers(
    '[all[shadows+tiddlers]tag[$:/tags/TextEditor/Snippet]] [all[tiddlers+shadows]prefix[$:/snippets/]] [all[shadows+tiddlers]tag[$:/tags/KaTeX/Snippet]] -[is[draft]]'
  );

  const source: ISource[] = userSnippetTiddlers.map((title) => {
    const { caption, text = '' } = $tw.wiki.getTiddler(title)?.fields!;

    return {
      vanillaTitle: title,
      title: title.split('/').pop()!,
      text: text.trim(),
      caption: caption as ISource['caption']
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

  // load builtin snippets
  source.push(...usersnippets);
  // 重复的会被覆盖？??
  const filteredSource = source.filter((item) => item.title && item.text);

  return filteredSource.map((info) => {
    return snip(info.text, {
      label: conf.delimiter() + (info.caption ? info.caption : info.title),
      displayLabel: info.caption ? info.caption : info.title,
      type: 'cm-snippet', // real added class is cm-completionIcon-cm-snippets
      boost:
        info.caption?.startsWith('$') ||
        info.title?.startsWith('$') ||
        info.caption?.startsWith('{')
          ? 0
          : 1,
      // detail: info.vanillaTitle ? info.vanillaTitle : info.title,
      info: conf.snippetPreview()
        ? () => renderTid(info.vanillaTitle || info.title, conf.footer())
        : '',
      section: menu.snippets
    });
  });
}
