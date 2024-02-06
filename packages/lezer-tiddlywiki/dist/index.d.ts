import { LRParser } from '@lezer/lr';
import { NodePropSource } from '@lezer/common';

declare const parser: LRParser;

declare const tiddlywikiHighlighting: NodePropSource;

export { parser as TiddlyWikiParser, tiddlywikiHighlighting };
