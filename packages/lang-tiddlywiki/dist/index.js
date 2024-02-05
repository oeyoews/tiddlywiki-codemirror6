import { parser, tiddlywikiHighlighting } from 'lezer-tiddlywiki';
import { LRLanguage, indentNodeProp, delimitedIndent, foldNodeProp, foldInside, LanguageSupport } from '@codemirror/language';

const tiddlywikiLanguage = /*@__PURE__*/LRLanguage.define({
    name: 'tiddlywiki',
    parser: /*@__PURE__*/parser.configure({
        props: [
            /*@__PURE__*/indentNodeProp.add({
                Application: /*@__PURE__*/delimitedIndent({ closing: ')', align: false })
            }),
            /*@__PURE__*/foldNodeProp.add({
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
function tiddlywiki(config = {}) {
    return new LanguageSupport(tiddlywikiLanguage, []);
}

export { tiddlywiki, tiddlywikiLanguage };
