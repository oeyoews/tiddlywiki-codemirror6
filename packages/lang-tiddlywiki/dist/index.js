import { parser, tiddlywikiHighlighting } from 'lezer-tiddlywiki';
import { LRLanguage, indentNodeProp, delimitedIndent, foldNodeProp, foldInside, LanguageSupport } from '@codemirror/language';

const tiddlywikiLanguage = /*@__PURE__*/LRLanguage.define({
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
function tiddlywiki() {
    return new LanguageSupport(tiddlywikiLanguage, []);
}

export { tiddlywiki, tiddlywikiLanguage };
