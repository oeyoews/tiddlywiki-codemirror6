import { snippetCompletion } from '@codemirror/autocomplete';

export default function getAllSnippets() {
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
    snippetCompletion(`${info.text}`, {
      label: info.title,
      displayLabel: info.caption as string, // 显示字符
      type: 'keyword',
      apply: info.text,
      info: info.text
    })
  );
}
