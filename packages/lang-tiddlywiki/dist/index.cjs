'use strict';

var lezerTiddlywiki = require('lezer-tiddlywiki');
var language = require('@codemirror/language');

const tiddlywikiLanguage = language.LRLanguage.define({
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
