import { CompletionContext } from '@codemirror/autocomplete';
import cmeConfig from '../cmeConfig';
import triggerType from '../utils/triggerType';
import sources from '../completions/sources';

// @see-also: https://github.com/codemirror/lang-javascript/blob/4dcee95aee9386fd2c8ad55f93e587b39d968489/src/complete.ts
// https://codemirror.net/examples/autocompletion/
export default function completions(context: CompletionContext) {
  // const word = context.matchBefore(/\w*/); // 这种遇到短横线会消失，但是不影响多次触发同一行内
  // const word = context.matchBefore(/<\$/);

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
  const lastWord = doc.sliceString(wordStart, cursorPos);
  if (wordStart === cursorPos) {
    return;
  }

  let dynamicSource = sources.userSnippets();

  if (lastWord.length < cmeConfig.minLength()) {
    return;
  }

  if (lastWord.startsWith(triggerType.doubleBrackets)) {
    dynamicSource = sources.linkSnippets();
  } else if (lastWord.startsWith('[img[')) {
    dynamicSource = sources.imageSnippets();
  } else if (lastWord.startsWith(triggerType.doublecurlyBrackets)) {
    dynamicSource = sources.embedSnippets();
  } else if (lastWord.startsWith(triggerType.widgetArrow)) {
    dynamicSource = sources.widgetSnippets();
  }

  return {
    from: wordStart,
    options: dynamicSource,
    validFor
  };
}
