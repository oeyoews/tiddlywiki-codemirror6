import {
  Completion,
  CompletionContext,
  CompletionResult
} from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import cm6 from '@/cm6/config';
import triggerType from '@/cm6/modules/constants/triggerType';
import sources from '@/cm6/modules/completions/sources';
import { IWidget } from '@/cm6/types/IWidget';
import { EditorView } from '@codemirror/view';
import { isTrigger } from '@/cm6/utils/isTrigger';

// TODO: use ifIn to better completion.
// @see-also: https://github.com/codemirror/lang-javascript/blob/4dcee95aee9386fd2c8ad55f93e587b39d968489/src/complete.ts
// https://codemirror.net/examples/autocompletion/
// maybe help: https://github.com/Gk0Wk/TW5-CodeMirror-Enhanced/blob/811760507bfcd5493df4d5c117d33d7bfa076ab2/src/cme/addon/hint/hint-tw5-tiddler.ts#L58
// IME: https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event
//  https://codemirror.net/docs/migration/
export default (widget: IWidget, self: any) => {
  return (context: CompletionContext): CompletionResult | undefined => {
    const cm: EditorView = self.cm;

    if (cm.composing) return;

    const nodeBefore = syntaxTree(context.state).resolveInner(context.pos);
    if (!cm6.commentComplete()) {
      if (
        nodeBefore.name === 'LineComment' ||
        nodeBefore.name === 'CommentBlock'
      ) {
        return;
      }
    }
    let validFor: RegExp = /^[\w$]*$/;

    // ifNotIn(context ); // TODO: disable completion in comment node
    const cursorPos = context.state.selection.main.head;
    const doc = context.state.doc;

    let wordStart: number = cursorPos;

    while (
      wordStart > 0 &&
      /[^\s]/.test(doc.sliceString(wordStart - 1, wordStart)) // 使用 [^\s] 表示非空白字符
    ) {
      wordStart--;
    }

    // 获取光标位置前最后一个单词
    let lastWord = doc.sliceString(wordStart, cursorPos);

    if (lastWord.length < cm6.minLength() || wordStart === cursorPos) {
      //  closeCompletion(context);
      return;
    }

    // NOTE: 一定要保证是数组
    let options: Completion[] = sources.wordsSnippets();

    // 不适合使用 map, 需要动态生成列表
    // TODO: 每次都要计算 ???
    switch (true) {
      case isTrigger(lastWord, triggerType.codeblocks):
        options = sources.codeblocksSnippets();
        break;
      case isTrigger(lastWord, triggerType.mermaid):
        options = sources.mermaidSnippets(widget);
        break;
      case isTrigger(lastWord, triggerType.md):
        if ($tw.modules.titles['$:/plugins/cdr/markdown-more/startup.js']) {
          options = sources.mdSnippets();
        }
        break;
      case isTrigger(lastWord, triggerType.command):
        options = sources.commandSnippets(widget);
        break;
      case isTrigger(lastWord, triggerType.filetype):
        options = sources.filetypeSnippets(widget);
        break;
      case isTrigger(lastWord, triggerType.tag):
        options = sources.tagSnippets(widget);
        break;
      case isTrigger(lastWord, triggerType.link):
        options = sources.linkSnippets();
        // validFor = new RegExp(/\[\[([^\]]*)\]\]/);
        break;

      case isTrigger(lastWord, triggerType.img):
        options = sources.imageSnippets();
        // validFor = new RegExp(/(\[img\[)([.?+])(\]\])?/);
        break;

      case isTrigger(lastWord, triggerType.embed):
        options = sources.embedSnippets();
        break;

      case isTrigger(lastWord, triggerType.widget):
        options = sources.widgetSnippets();
        break;

      case isTrigger(lastWord, triggerType.macro):
        options = sources.macroSnippets();
        break;
      case isTrigger(lastWord, triggerType.emoji):
        options = sources.emojiSnippets();
        break;
      // TODO: 中文顿号不会被触发，因为 w 会分割他？？？
      case lastWord.startsWith(cm6.delimiter()) &&
        lastWord.charAt(1) !== cm6.delimiter():
        // @see-also https://discuss.codemirror.net/t/mid-word-completion-that-replaces-the-rest-of-the-word/7262
        options = sources.userSnippets();
        // options.forEach((option) => {
        //   option.apply = apply;
        // });
        break;
      // return {
      //   from: wordStart + 1, // @deprecated: 这会影响匹配项，所以需要加 1, apply 会减 1
      //   options,
      //   validFor
      // };

      default:
        break;
    }

    return {
      from: wordStart,
      options,
      // filter: false,
      getMatch: (compltion: Completion, matched) => {
        if (!cm6.matchText()) return [];
        return matched as [];
      },
      validFor
    };
  };
};
