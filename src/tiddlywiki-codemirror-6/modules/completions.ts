import { CompletionContext } from '@codemirror/autocomplete';
import cmeConfig from '../cmeConfig';
import triggerType from '../utils/triggerType';
import sources from '../completions/sources';

// @see-also: https://github.com/codemirror/lang-javascript/blob/4dcee95aee9386fd2c8ad55f93e587b39d968489/src/complete.ts
// https://codemirror.net/examples/autocompletion/
export default (context: CompletionContext) => {
  const cursorPos = context.state.selection.main.head;
  const doc = context.state.doc;

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

  // let dynamicSource = sources.userSnippets();
  let options = sources.userSnippets();

  if (lastWord.startsWith(triggerType.doubleBrackets)) {
    options = sources.linkSnippets();
  } else if (lastWord.startsWith('[img[')) {
    options = sources.imageSnippets();
    console.log(options);
  } else if (lastWord.startsWith(triggerType.doublecurlyBrackets)) {
    options = sources.embedSnippets();
  } else if (lastWord.startsWith(triggerType.widgetArrow)) {
    options = sources.widgetSnippets();
  } else if (lastWord.startsWith('/')) {
    // TODO: https://discuss.codemirror.net/t/mid-word-completion-that-replaces-the-rest-of-the-word/7262
    // TODO: modify apply to remove /
    // lastWord = lastWord.replace(/^\/+/, '');
    // options = [...sources.userSnippets()];
    // return {
    //   from: wordStart + 1, // 这会影响匹配项
    //   options,
    //   validFor
    // };
  }

  return {
    from: wordStart,
    options,
    validFor
  };
};
