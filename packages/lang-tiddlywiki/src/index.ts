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
        'FooBar/Bar': t.lineComment,
        Bar: t.lineComment,
        Identifier: t.variableName,
        Boolean: t.bool,
        String: t.string,
        LineComment: t.lineComment,
        '( )': t.paren
      })
    ]
  }),
  languageData: {
    // TODO
    commentTokens: {
      // line: '<!-- -->',
      block: {
        open: '<!--',
        close: '-->'
      }
    }
  }
});

export function tiddlywiki() {
  return new LanguageSupport(tiddlywikiLanguage);
}
