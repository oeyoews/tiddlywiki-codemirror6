import { snippetCompletion as snip } from '@codemirror/autocomplete';
import delimiter from 'src/tiddlywiki-codemirror-6/utils/triggerType';
import { menu } from 'src/tiddlywiki-codemirror-6/modules/config/menu';

export function macroSnippets() {
  const macros = Object.entries($tw.macros);
  // const usermacros = $tw.wiki.filterTiddlers(
  //   '[all[tiddlers+shadows]tag[$:/tags/Macro]!is[draft]get[text]search:title[define]search-replace:g:regexp[\\defines+(.+?)((s|S)+?(?=\\define|$)],[~$1|]search-replace:g[|~],[~]search-replace:g:regexp[^(s|S)*?~||(s|S)*$],[]split[~]!match[]]'
  // );

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
      label: delimiter.macro + name,
      displayLabel: name,
      type: 'cm-macro',
      info: paramList,
      section: menu.macros
    });
  });
}