import { LRLanguage, LanguageSupport } from '@codemirror/language';

declare const tiddlywikiLanguage: LRLanguage;
declare function tiddlywiki(): LanguageSupport;

export { tiddlywiki, tiddlywikiLanguage };
