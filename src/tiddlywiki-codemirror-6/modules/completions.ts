import {
  Completion,
  CompletionContext,
  CompletionResult
} from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import cm6 from '../cm6';
import triggerType from '../utils/triggerType';
import sources from '../completions/sources';

// TODO: use ifIn to better completion.
// @see-also: https://github.com/codemirror/lang-javascript/blob/4dcee95aee9386fd2c8ad55f93e587b39d968489/src/complete.ts
// https://codemirror.net/examples/autocompletion/
// maybe help: https://github.com/Gk0Wk/TW5-CodeMirror-Enhanced/blob/811760507bfcd5493df4d5c117d33d7bfa076ab2/src/cme/addon/hint/hint-tw5-tiddler.ts#L58
// IME: https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event
//  https://codemirror.net/docs/migration/
export default (context: CompletionContext): CompletionResult | undefined => {
  const nodeBefore = syntaxTree(context.state).resolveInner(context.pos);
  if (!cm6.commentComplete()) {
    if (
      nodeBefore.name === 'LineComment' ||
      nodeBefore.name === 'CommentBlock'
    ) {
      return;
    }
  }
  const validFor: RegExp = /^[\w$]*$/;

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

  // 中文是一个汉字等于两个英文字符
  if (lastWord.length < cm6.minLength() || wordStart === cursorPos) {
    return;
  }

  // NOTE: 一定要保证是数组
  let options: Completion[] = sources.wordsSnippets();

  switch (true) {
    case lastWord.startsWith(triggerType.link):
      options = sources.linkSnippets();
      break;

    case lastWord.startsWith(triggerType.img):
      options = sources.imageSnippets();
      break;

    case lastWord.startsWith(triggerType.embed):
      options = sources.embedSnippets();
      break;

    case lastWord.startsWith(triggerType.widget):
      options = sources.widgetSnippets();
      break;

    case lastWord.startsWith(triggerType.macro):
      options = sources.macroSnippets();
      break;
    case lastWord.startsWith(triggerType.emoji):
      options = sources.emojiSnippets();
      break;
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
    getMatch: (compltion, matched) => {
      /** @deprecated: class: cm-completionMatchedText */
      return matched as [];
    },
    validFor
  };
};
