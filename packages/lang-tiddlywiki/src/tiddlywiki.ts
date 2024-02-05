import { tiddlywikiHighlighting, parser } from 'lezer-tiddlywiki';

import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  delimitedIndent
} from '@codemirror/language';

export const tiddlywikiLanguage = LRLanguage.define({
  name: 'tiddlywiki',
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({ closing: ')', align: false })
      }),
      foldNodeProp.add({
        Application: foldInside
      }),
      tiddlywikiHighlighting
    ]
  }),
  languageData: {
    commentTokens: {
      block: {
        open: '<!--',
        close: '-->'
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

export function tiddlywiki(config = {}) {
  return new LanguageSupport(tiddlywikiLanguage, []);
}
