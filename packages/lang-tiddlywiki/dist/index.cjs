'use strict';

var lezerTidlywiki = require('lezer-tidlywiki');
var language = require('@codemirror/language');
var highlight = require('@lezer/highlight');

const tiddlywikiLanguage = language.LRLanguage.define({
    parser: lezerTidlywiki.parser.configure({
        props: [
            language.indentNodeProp.add({
                Application: language.delimitedIndent({ closing: ')', align: false })
            }),
            language.foldNodeProp.add({
                Application: language.foldInside
            }),
            highlight.styleTags({
                Keyword: highlight.tags.keyword,
                Image: highlight.tags.strong,
                Heading: highlight.tags.heading,
                Delete: highlight.tags.strikethrough,
                Bold: highlight.tags.strong,
                Underline: highlight.tags.strong,
                Identifier: highlight.tags.strong,
                Italic: highlight.tags.emphasis,
                // TODO use list
                List: highlight.tags.number,
                Blockquote: highlight.tags.quote,
                LineComment: highlight.tags.blockComment,
                Definition: highlight.tags.strong
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
    return new language.LanguageSupport(tiddlywikiLanguage, []);
}

exports.tiddlywiki = tiddlywiki;
exports.tiddlywikiLanguage = tiddlywikiLanguage;
