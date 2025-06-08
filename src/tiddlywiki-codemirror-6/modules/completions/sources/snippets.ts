import { snippetCompletion as snip } from '@codemirror/autocomplete';
import conf from '@/cm6/config';
import { usersnippets } from '@/cm6/modules/completions/builtin/snippets';

const section = 'snippet';
const type = 'cm-snippet';
const delimiter =
  $tw.wiki.getTiddlerText('$:/config/codemirror-6/delimiter') || '/';
const description = 'snippets';

const renderCodeBlock = (snippet: ISource) => {
  if (!conf.snippetPreview()) return '';
  const domNode = document.createElement('div');
  domNode.className = 'cm-snippet-preview';

  let renderText = () => {
    const type = 'text/vnd.tiddlywiki';
    let oldText = `<$codeblock code="""${snippet.text}""" />`;
    if (conf.footer() && snippet.vanillaTitle) {
      oldText += `\n<footer style="text-align: right;margin-right: 10px">${snippet.vanillaTitle}</footer>`;
    }
    let html = $tw.wiki.renderText('text/html', type, oldText);
    return html;
  };

  domNode.innerHTML = renderText();
  return domNode;
};

function snippets() {
  const userSnippetTiddlers = $tw.wiki.filterTiddlers(
    '[all[shadows+tiddlers]tag[$:/tags/TextEditor/Snippet]] [all[shadows+tiddlers]prefix[$:/snippets/]] [all[shadows+tiddlers]tag[$:/tags/KaTeX/Snippet]] -[is[draft]]'
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
  const filteredSource = source.filter((item) => item.title && item.text);

  return filteredSource.map((snippet) => {
    return snip(snippet.text, {
      section,
      label: delimiter + (snippet.caption || snippet.title.split('/').pop()!),
      displayLabel: snippet.caption || snippet.title,
      // detail: snippet.desc || '',
      type, // real added class is cm-completionIcon-cm-snippets
      boost:
        $tw.wiki.isSystemTiddler(snippet.vanillaTitle!) ||
        $tw.wiki.isShadowTiddler(snippet.vanillaTitle!) ||
        snippet.caption?.startsWith('{')
          ? -99
          : 99,
      // detail: info.vanillaTitle ? info.vanillaTitle : info.title,
      // @ts-expect-error
      info: () => renderCodeBlock(snippet)
    });
  });
}

export default {
  section,
  type,
  delimiter,
  description,
  snippets
};
