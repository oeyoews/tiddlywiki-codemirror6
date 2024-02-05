import { styleTags, tags as t } from '@lezer/highlight';
// import { NodePropSource } from '@lezer/common';

export const tiddlywikiHighlighting = styleTags({
  Keyword: t.keyword,
  Image: t.strong,
  Heading: t.heading,
  Delete: t.strikethrough,
  Bold: t.strong,
  Underline: t.strong,
  Identifier: t.strong,
  Italic: t.emphasis,
  List: t.number,
  Blockquote: t.quote,
  LineComment: t.blockComment,
  Definition: t.strong
});
