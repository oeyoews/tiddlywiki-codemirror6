import {
  // insertCompletionText,
  // Completion,
  CompletionContext
} from '@codemirror/autocomplete';
import cmeConfig from '../cmeConfig';
import triggerType from '../utils/triggerType';
import sources from '../completions/sources';

// @see-also: https://github.com/codemirror/lang-javascript/blob/4dcee95aee9386fd2c8ad55f93e587b39d968489/src/complete.ts
// https://codemirror.net/examples/autocompletion/
export default (context: CompletionContext) => {
  const cursorPos = context.state.selection.main.head;
  const doc = context.state.doc;

  // const apply: Completion['apply'] = (view, completion, from, to) => {
  //   view.dispatch(
  //     insertCompletionText(view.state, completion.info as any, from - 1, to)
  //   );
  // };

  let wordStart = cursorPos;
  const validFor = /^[\w$]*$/;

  while (
    wordStart > 0 &&
    /[^\s]/.test(doc.sliceString(wordStart - 1, wordStart)) // 使用 [^\s] 表示非空白字符
  ) {
    wordStart--;
  }

  // 获取光标位置前最后一个单词
  let lastWord = doc.sliceString(wordStart, cursorPos);
  if (wordStart === cursorPos && lastWord.length < 1) {
    return;
  }

  if (lastWord.length < cmeConfig.minLength()) {
    return;
  }

  // NOTE: 一定要保证是数组
  let options: any[] = sources.wordsSnippets();

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
    case lastWord.startsWith(cmeConfig.delimiter()):
      // @see-also https://discuss.codemirror.net/t/mid-word-completion-that-replaces-the-rest-of-the-word/7262
      options = sources.userSnippets();
      console.log(options);
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
    validFor
  };
};
