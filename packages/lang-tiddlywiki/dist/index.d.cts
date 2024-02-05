import { LRLanguage, LanguageSupport } from '@codemirror/language';

declare const tiddlywikiLanguage: LRLanguage;
declare function tiddlywiki(config?: {}): LanguageSupport;

export { tiddlywiki, tiddlywikiLanguage };
