import { TiddlyWikiParser, tiddlywikiHighlighting } from 'lezer-tiddlywiki';
import { foldService, syntaxTree, LRLanguage, indentNodeProp, foldNodeProp, delimitedIndent, foldInside, LanguageSupport } from '@codemirror/language';
import { NodeProp } from '@lezer/common';

const headingProp = /*@__PURE__*/new NodeProp();
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
const headerIndent = /*@__PURE__*/foldService.of((state, start, end) => {
    for (let node = syntaxTree(state).resolveInner(end, -1); node; node = node.parent) {
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
const tiddlywikiLanguage = /*@__PURE__*/LRLanguage.define({
    name: 'tiddlywiki',
    parser: /*@__PURE__*/TiddlyWikiParser.configure({
        props: [
            /*@__PURE__*/indentNodeProp.add({
                Application: /*@__PURE__*/delimitedIndent({ closing: ')', align: false })
            }),
            /*@__PURE__*/headingProp.add(isHeading),
            /*@__PURE__*/foldNodeProp.add({
                Application: foldInside
            }),
            tiddlywikiHighlighting
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
    return new LanguageSupport(tiddlywikiLanguage, [headerIndent]);
}

export { tiddlywiki, tiddlywikiLanguage };
