/*\
title: $:/plugins/BTC/tiddlywiki-codemirror-6/modules/utils/codemirror-highlight-utils.js
type: application/javascript
module-type: codemirror-utils

\*/

(function () {
  // Solarized light theme adapted from: https://github.com/craftzdog/cm6-themes/blob/main/packages/solarized-light/src/index.ts

  var slbase00 = '#657b83',
    slbase01 = '#586e75',
    slbase02 = '#073642',
    slbase03 = '#002b36',
    slbase0 = '#839496',
    slbase1 = '#93a1a1',
    slbase2 = '#eee8d5',
    slbase3 = '#fdf6e3',
    slbase_red = '#dc322f',
    slbase_orange = '#cb4b16',
    slbase_yellow = '#b58900',
    slbase_green = '#859900',
    slbase_cyan = '#2aa198',
    slbase_blue = '#268bd2',
    slbase_violet = '#6c71c4',
    slbase_magenta = '#d33682';

  var slinvalid = '#d30102';
  var sldarkBackground = '#dfd9c8';
  var slhighlightBackground = sldarkBackground;
  var slbackground = slbase3;
  var sltooltipBackground = slbase01;
  var slselection = sldarkBackground;
  var slcursor = slbase01;

  exports.getSolarizedLightHighlightStyle = function (HighlightStyle, tags) {
    var highlightStyle = HighlightStyle.define([
      { tag: tags.keyword, color: slbase_green },
      {
        tag: [
          tags.name,
          tags.deleted,
          tags.character,
          tags.propertyName,
          tags.macroName,
        ],
        color: slbase_cyan,
      },
      { tag: [tags.variableName], color: slbase_blue },
      { tag: [tags.function(tags.variableName)], color: slbase_blue },
      { tag: [tags.labelName], color: slbase_magenta },
      {
        tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
        color: slbase_yellow,
      },
      { tag: [tags.definition(tags.name), tags.separator], color: slbase_cyan },
      { tag: [tags.brace], color: slbase_magenta },
      {
        tag: [tags.annotation],
        color: slinvalid,
      },
      {
        tag: [
          tags.number,
          tags.changed,
          tags.annotation,
          tags.modifier,
          tags.self,
          tags.namespace,
        ],
        color: slbase_magenta,
      },
      {
        tag: [tags.typeName, tags.className],
        color: slbase_orange,
      },
      {
        tag: [tags.operator, tags.operatorKeyword],
        color: slbase_violet,
      },
      {
        tag: [tags.tagName],
        color: slbase_blue,
      },
      {
        tag: [tags.squareBracket],
        color: slbase_red,
      },
      {
        tag: [tags.angleBracket],
        color: slbase02,
      },
      {
        tag: [tags.attributeName],
        color: slbase1,
      },
      {
        tag: [tags.regexp],
        color: slinvalid,
      },
      {
        tag: [tags.quote],
        color: slbase_green,
      },
      { tag: [tags.string], color: slbase_yellow },
      {
        tag: tags.link,
        color: slbase_cyan,
        textDecoration: 'underline',
        textUnderlinePosition: 'under',
      },
      {
        tag: [tags.url, tags.escape, tags.special(tags.string)],
        color: slbase_yellow,
      },
      { tag: [tags.meta], color: slbase_red },
      { tag: [tags.comment], color: slbase02, fontStyle: 'italic' },
      { tag: tags.strong, fontWeight: 'bold', color: slbase01 },
      { tag: tags.emphasis, fontStyle: 'italic', color: slbase_green },
      { tag: tags.strikethrough, textDecoration: 'line-through' },
      { tag: tags.heading, fontWeight: 'bold', color: slbase_yellow },
      { tag: tags.heading1, fontWeight: 'bold', color: slbase03 },
      {
        tag: [tags.heading2, tags.heading3, tags.heading4],
        fontWeight: 'bold',
        color: slbase03,
      },
      {
        tag: [tags.heading5, tags.heading6],
        color: slbase03,
      },
      {
        tag: [tags.atom, tags.bool, tags.special(tags.variableName)],
        color: slbase_magenta,
      },
      {
        tag: [tags.processingInstruction, tags.inserted, tags.contentSeparator],
        color: slbase_red,
      },
      {
        tag: [tags.contentSeparator],
        color: slbase_yellow,
      },
      {
        tag: tags.invalid,
        color: slbase02,
        borderBottom: `1px dotted ${slbase_red}`,
      },
    ]);

    return highlightStyle;
  };

  // Solarized dark theme adapted from: https://github.com/craftzdog/cm6-themes/blob/main/packages/solarized-dark/src/index.ts

  var sdbase00 = '#002b36',
    sdbase01 = '#073642',
    sdbase02 = '#586e75',
    sdbase03 = '#657b83',
    sdbase04 = '#839496',
    sdbase05 = '#93a1a1',
    sdbase06 = '#eee8d5',
    sdbase07 = '#fdf6e3',
    sdbase_red = '#dc322f',
    sdbase_orange = '#cb4b16',
    sdbase_yellow = '#b58900',
    sdbase_green = '#859900',
    sdbase_cyan = '#2aa198',
    sdbase_blue = '#268bd2',
    sdbase_violet = '#6c71c4',
    sdbase_magenta = '#d33682';

  var sdinvalid = '#d30102';
  var sdstone = sdbase04;
  var sddarkBackground = '#00252f';
  var sdhighlightBackground = '#173541';
  var sdbackground = sdbase00;
  var sdtooltipBackground = sdbase01;
  var sdselection = '#173541';
  var sdcursor = sdbase04;

  exports.getSolarizedDarkHighlightStyle = function (HighlightStyle, tags) {
    var highlightStyle = HighlightStyle.define([
      { tag: tags.keyword, color: sdbase_green },
      {
        tag: [
          tags.name,
          tags.deleted,
          tags.character,
          tags.propertyName,
          tags.macroName,
        ],
        color: sdbase_cyan,
      },
      { tag: [tags.variableName], color: sdbase05 },
      { tag: [tags.function(tags.variableName)], color: sdbase_blue },
      { tag: [tags.labelName], color: sdbase_magenta },
      {
        tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
        color: sdbase_yellow,
      },
      { tag: [tags.definition(tags.name), tags.separator], color: sdbase_cyan },
      { tag: [tags.brace], color: sdbase_magenta },
      {
        tag: [tags.annotation],
        color: sdinvalid,
      },
      {
        tag: [
          tags.number,
          tags.changed,
          tags.annotation,
          tags.modifier,
          tags.self,
          tags.namespace,
        ],
        color: sdbase_magenta,
      },
      {
        tag: [tags.typeName, tags.className],
        color: sdbase_orange,
      },
      {
        tag: [tags.operator, tags.operatorKeyword],
        color: sdbase_violet,
      },
      {
        tag: [tags.tagName],
        color: sdbase_blue,
      },
      {
        tag: [tags.squareBracket],
        color: sdbase_red,
      },
      {
        tag: [tags.angleBracket],
        color: sdbase02,
      },
      {
        tag: [tags.attributeName],
        color: sdbase05,
      },
      {
        tag: [tags.regexp],
        color: sdinvalid,
      },
      {
        tag: [tags.quote],
        color: sdbase_green,
      },
      { tag: [tags.string], color: sdbase_yellow },
      {
        tag: tags.link,
        color: sdbase_cyan,
        textDecoration: 'underline',
        textUnderlinePosition: 'under',
      },
      {
        tag: [tags.url, tags.escape, tags.special(tags.string)],
        color: sdbase_yellow,
      },
      { tag: [tags.meta], color: sdbase_red },
      { tag: [tags.comment], color: sdbase02, fontStyle: 'italic' },
      { tag: tags.strong, fontWeight: 'bold', color: sdbase06 },
      { tag: tags.emphasis, fontStyle: 'italic', color: sdbase_green },
      { tag: tags.strikethrough, textDecoration: 'line-through' },
      { tag: tags.heading, fontWeight: 'bold', color: sdbase_yellow },
      { tag: tags.heading1, fontWeight: 'bold', color: sdbase07 },
      {
        tag: [tags.heading2, tags.heading3, tags.heading4],
        fontWeight: 'bold',
        color: sdbase06,
      },
      {
        tag: [tags.heading5, tags.heading6],
        color: sdbase06,
      },
      {
        tag: [tags.atom, tags.bool, tags.special(tags.variableName)],
        color: sdbase_magenta,
      },
      {
        tag: [tags.processingInstruction, tags.inserted, tags.contentSeparator],
        color: sdbase_red,
      },
      {
        tag: [tags.contentSeparator],
        color: sdbase_yellow,
      },
      {
        tag: tags.invalid,
        color: sdbase02,
        borderBottom: `1px dotted ${sdbase_red}`,
      },
    ]);

    return highlightStyle;
  };
})();
