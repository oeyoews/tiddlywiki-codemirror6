import { parser } from 'lezer-tidlywiki';
import { LRLanguage, indentNodeProp, delimitedIndent, foldNodeProp, foldInside, LanguageSupport } from '@codemirror/language';
import { styleTags, tags } from '@lezer/highlight';

const tiddlywikiLanguage = /*@__PURE__*/LRLanguage.define({
    parser: /*@__PURE__*/parser.configure({
        props: [
            /*@__PURE__*/indentNodeProp.add({
                Application: /*@__PURE__*/delimitedIndent({ closing: ')', align: false })
            }),
            /*@__PURE__*/foldNodeProp.add({
                Application: foldInside
            }),
            /*@__PURE__*/styleTags({
                Keyword: tags.keyword,
                Image: tags.strong,
                Heading: tags.heading,
                Delete: tags.strikethrough,
                Bold: tags.strong,
                Underline: tags.strong,
                Identifier: tags.strong,
                Italic: tags.emphasis,
                // TODO use list
                List: tags.number,
                Blockquote: tags.quote,
                LineComment: tags.blockComment,
                Definition: tags.strong
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
function tiddlywiki() {
    return new LanguageSupport(tiddlywikiLanguage, []);
}

export { tiddlywiki, tiddlywikiLanguage };
