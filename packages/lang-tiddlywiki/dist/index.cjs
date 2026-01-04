'use strict';

var lezerTiddlywiki = require('lezer-tiddlywiki');
var language = require('@codemirror/language');
var common = require('@lezer/common');

const headingProp = new common.NodeProp();
function isHeading(type) {
    let match = /^(?:ATX|Setext)Heading(\d)$/.exec(type.name);
    return match ? +match[1] : undefined;
}
function findSectionEnd(headerNode, level) {
    let last = headerNode;
    for (;;) {
        let next = last.nextSibling, heading;
        if (!next || ((heading = isHeading(next.type)) != null && heading <= level))
            break;
        last = next;
    }
    return last.to;
}
const headerIndent = language.foldService.of((state, start, end) => {
    for (let node = language.syntaxTree(state).resolveInner(end, -1); node; node = node.parent) {
        if (node.from < start)
            break;
        let heading = node.type.prop(headingProp);
        if (heading == null)
            continue;
        let upto = findSectionEnd(node, heading);
        if (upto > end)
            return { from: end, to: upto };
    }
    return null;
});
const tiddlywikiLanguage = language.LRLanguage.define({
    name: 'tiddlywiki',
    parser: lezerTiddlywiki.TiddlyWikiParser.configure({
        props: [
            language.indentNodeProp.add({
                Application: language.delimitedIndent({ closing: ')', align: false })
            }),
            headingProp.add(isHeading),
            language.foldNodeProp.add({
                Application: language.foldInside
            }),
            lezerTiddlywiki.tiddlywikiHighlighting
        ]
    }),
    languageData: {
        commentTokens: {
            block: {
                open: '<!-- ',
                close: ' -->'
            }
        },
        indentOnInput: /^\s*<\/\w+\W$/
    }
});
function tiddlywiki(config = {}) {
    /*   let { codeLanguages, defaultCodeLanguage, completeHTMLTags = true } = config;
    let support = [htmlNoMatch.support],
      defaultCode;
    if (defaultCodeLanguage instanceof LanguageSupport) {
      support.push(defaultCodeLanguage.support);
      defaultCode = defaultCodeLanguage.language;
    } else if (defaultCodeLanguage) {
      defaultCode = defaultCodeLanguage;
    }
    let codeParser =
      codeLanguages || defaultCode
        ? getCodeParser(codeLanguages, defaultCode)
        : undefined;
    extensions.push(
      parseCode({ codeParser, htmlParser: htmlNoMatch.language.parser })
    ); */
    return new language.LanguageSupport(tiddlywikiLanguage, [headerIndent]);
}

exports.tiddlywiki = tiddlywiki;
exports.tiddlywikiLanguage = tiddlywikiLanguage;
