import { snippetCompletion as snip } from '@codemirror/autocomplete';

function getAllSnippets() {
  const snippetTiddlers = $tw.wiki.filterTiddlers(
    '[all[shadows+system+tiddlers]tag[$:/tags/TextEditor/Snippet]!has[draft.of]]'
  );

  const allInfo = snippetTiddlers.map((title) => {
    const { caption = '', text = '' } = $tw.wiki.getTiddler(title)?.fields!;
    return {
      title: title.split('/').pop()!,
      text,
      caption
    };
  });

  return allInfo.map((info) =>
    // support placeholder
    snip(`${info.text}`, {
      label: info.title,
      displayLabel: info.caption as string, // 覆盖 label
      type: 'cm-snippet', // class: cm-completionIcon-cm-snippets
      apply: info.text,
      info: info.text
    })
  );
}

export const snippets = getAllSnippets();
