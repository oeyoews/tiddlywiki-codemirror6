import { tiddlywikiHighlighting, TiddlyWikiParser } from 'lezer-tiddlywiki';
// import { GFM, Subscript, Superscript, Emoji } from '@lezer/markdown';

import {
  LanguageDescription,
  Language,
  LRLanguage,
  foldService,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  syntaxTree,
  delimitedIndent
} from '@codemirror/language';
import { SyntaxNode, NodeType, NodeProp } from '@lezer/common';
import { Extension } from '@codemirror/state';

const headingProp = new NodeProp<number>();

function isHeading(type: NodeType) {
  let match = /^(?:ATX|Setext)Heading(\d)$/.exec(type.name);
  return match ? +match[1] : undefined;
}

function findSectionEnd(headerNode: SyntaxNode, level: number) {
  let last = headerNode;
  for (; ;) {
    let next = last.nextSibling,
      heading;
    if (!next || ((heading = isHeading(next.type)) != null && heading <= level))
      break;
    last = next;
  }
  return last.to;
}

const headerIndent: Extension = foldService.of((state, start, end) => {
  for (
    let node: SyntaxNode | null = syntaxTree(state).resolveInner(end, -1);
    node;
    node = node.parent
  ) {
    if (node.from < start) break;
    let heading = node.type.prop(headingProp);
    if (heading == null) continue;
    let upto = findSectionEnd(node, heading);
    if (upto > end) return { from: end, to: upto };
  }
  return null;
});

export const tiddlywikiLanguage = LRLanguage.define({
  name: 'tiddlywiki',
  parser: TiddlyWikiParser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({ closing: ')', align: false })
      }),
      headingProp.add(isHeading),
      foldNodeProp.add({
        Application: foldInside
      }),
      tiddlywikiHighlighting
    ]
  }),
  languageData: {
    commentTokens: {
      block: {
        open: '<!-- ',
        close: ' -->'
      }
    },
    indentOnInput: /^\s*<\/\w+\W$/
  }
});

// export const tiddlywikiCompletion = tiddlywikiLanguage.data.of({
// autocomplete: completeFromList([
//   { label: 'tiddlywiki', type: 'keyword' },
//   { label: 'define', type: 'keyword' },
//   { label: 'let', type: 'keyword' }
// ])
// });

// https://github.com/codemirror/lang-markdown/blob/main/src/index.ts#L83
type ITiddlywikiConfig = {
  defaultCodeLanguage?: Language | LanguageSupport;
  codeLanguages?:
  | readonly LanguageDescription[]
  | ((info: string) => Language | LanguageDescription | null);
  completeHTMLTags?: boolean;
};

export function tiddlywiki(config: ITiddlywikiConfig = {}) {
  /*   let { codeLanguages, defaultCodeLanguage, completeHTMLTags = true } = config;
  let support = [htmlNoMatch.support],
    defaultCode;
  if (defaultCodeLanguage instanceof LanguageSupport) {
    support.push(defaultCodeLanguage.support);
    defaultCode = defaultCodeLanguage.language;
  } else if (defaultCodeLanguage) {
    defaultCode = defaultCodeLanguage;
  }
  let codeParser =
    codeLanguages || defaultCode
      ? getCodeParser(codeLanguages, defaultCode)
      : undefined;
  extensions.push(
    parseCode({ codeParser, htmlParser: htmlNoMatch.language.parser })
  ); */
  return new LanguageSupport(tiddlywikiLanguage, [headerIndent]);
}
