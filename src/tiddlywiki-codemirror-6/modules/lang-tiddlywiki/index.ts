import { LRLanguage } from '@codemirror/language';

/// A language provider based on the [Lezer JavaScript
/// parser](https://github.com/lezer-parser/javascript), extended with
/// highlighting and indentation information.
export const tiddlywikiLanguage = LRLanguage.define({
  name: 'tiddlywiki',
  parser: null as any,
  languageData: {
    closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
    commentTokens: { line: '<!-- -->', block: { open: '<!--', close: '-->' } },
    indentOnInput: /^\s*(?:case |default:|\{|\}|<\/)$/,
    wordChars: '$'
  }
});
