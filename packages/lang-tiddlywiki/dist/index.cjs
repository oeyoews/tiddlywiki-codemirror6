'use strict';

var lezerTiddlywiki = require('lezer-tiddlywiki');
var language = require('@codemirror/language');

const tiddlywikiLanguage = language.LRLanguage.define({
    name: 'tiddlywiki',
    parser: lezerTiddlywiki.parser.configure({
        props: [
            language.indentNodeProp.add({
                Application: language.delimitedIndent({ closing: ')', align: false })
            }),
            language.foldNodeProp.add({
                Application: language.foldInside
            }),
            lezerTiddlywiki.tiddlywikiHighlighting
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
    return new language.LanguageSupport(tiddlywikiLanguage, []);
}

exports.tiddlywiki = tiddlywiki;
exports.tiddlywikiLanguage = tiddlywikiLanguage;
