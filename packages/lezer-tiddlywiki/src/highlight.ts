import { styleTags, tags as t, Tag } from '@lezer/highlight';
import * as Rules from './parser.terms.js';
import { NodePropSource } from '@lezer/common';

type IRules = keyof typeof Rules;
type ITags = Record<IRules & string, Tag>;

const tags: Omit<ITags, 'Document'> = {
  Bold: t.strong,
  Italic: t.emphasis,
  Strikethrough: t.strikethrough,
  Keyword: t.keyword,
  Image: t.strong,
  Heading: t.heading,
  Underscore: t.strong,
  Identifier: t.strong,
  List: t.list,
  Blockquote: t.quote,
  LineComment: t.blockComment,
  Macro: t.strong,
  // '<<now>>': t.keyword,
  Definition: t.strong
};

export const tiddlywikiHighlighting: NodePropSource = styleTags(tags);
