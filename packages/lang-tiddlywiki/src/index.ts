import { parser } from './syntax.grammar';
import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  delimitedIndent
} from '@codemirror/language';
import { styleTags, tags as t } from '@lezer/highlight';

export const tiddlywikiLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({ closing: ')', align: false })
      }),
      foldNodeProp.add({
        Application: foldInside
      }),
      styleTags({
        Keyword: t.keyword,
        Image: t.strong,
        Heading: t.heading,
        Delete: t.strikethrough,
        Bold: t.strong,
        Underline: t.strong,
        Identifier: t.strong,
        Italic: t.emphasis,
        // TODO use list
        List: t.number,
        Blockquote: t.quote,
        LineComment: t.blockComment,
        Definition: t.strong
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

// export const tiddlywikiCompletion = tiddlywikiLanguage.data.of({
// autocomplete: completeFromList([
//   { label: 'tiddlywiki', type: 'keyword' },
//   { label: 'define', type: 'keyword' },
//   { label: 'let', type: 'keyword' }
// ])
// });

export function tiddlywiki() {
  return new LanguageSupport(tiddlywikiLanguage, []);
}
