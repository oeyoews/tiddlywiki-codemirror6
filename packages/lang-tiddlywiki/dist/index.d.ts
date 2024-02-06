import { LRLanguage, LanguageSupport, Language, LanguageDescription } from '@codemirror/language';

declare const tiddlywikiLanguage: LRLanguage;
type ITiddlywikiConfig = {
    defaultCodeLanguage?: Language | LanguageSupport;
    codeLanguages?: readonly LanguageDescription[] | ((info: string) => Language | LanguageDescription | null);
    completeHTMLTags?: boolean;
};
declare function tiddlywiki(config?: ITiddlywikiConfig): LanguageSupport;

export { tiddlywiki, tiddlywikiLanguage };
