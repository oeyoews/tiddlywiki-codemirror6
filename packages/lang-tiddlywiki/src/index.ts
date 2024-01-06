import { parser } from './syntax.grammar';
import { completeFromList } from '@codemirror/autocomplete';
import { SyntaxNode, NodeType, NodeProp } from '@lezer/common';
import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  delimitedIndent
} from '@codemirror/language';
import { styleTags, tags as t } from '@lezer/highlight';

const headingProp = new NodeProp<number>();

export const tiddlywikiLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({ closing: ')', align: false })
      }),
      foldNodeProp.add({
        Application: foldInside
      }),
      headingProp.add(isHeading),
      styleTags({
        // Identifier: t.variableName,
        Heading: t.heading,
        // BlockComment: t.blockComment,
        // Boolean: t.bool,
        Keyword: t.keyword,
        String: t.string,
        // LineComment: t.lineComment,
        '( )': t.paren
      })
    ]
  }),
  languageData: {
    commentTokens: {
      block: {
        open: '<!--',
        close: '-->'
      }
    }
  }
});

export const tiddlywikiCompletion = tiddlywikiLanguage.data.of({
  // autocomplete: completeFromList([
  //   { label: 'tiddlywiki', type: 'keyword' },
  //   { label: 'define', type: 'keyword' },
  //   { label: 'let', type: 'keyword' }
  // ])
});

export function tiddlywiki() {
  return new LanguageSupport(tiddlywikiLanguage, [tiddlywikiCompletion]);
}

function isHeading(type: NodeType) {
  let match = /^(?:ATX|Setext)Heading(\d)$/.exec(type.name);
  return match ? +match[1] : undefined;
}
