import { CompletionContext } from '@codemirror/autocomplete';
import { widgets } from '../utils/getAllWidget';
import cmeConfig from '../cmeConfig';
import { getAllTiddlers } from '../utils/getAllTiddlers';
import triggerType from '../utils/triggerType';
import { images } from '../utils/getAllImage';
import { snippets } from '../utils/getAllSnippet';

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

  let sources = snippets;

  if (lastWord.length < cmeConfig.minLength()) {
    return;
  }

  if (lastWord.startsWith(triggerType.doubleBrackets)) {
    sources = getAllTiddlers(triggerType.doubleBrackets);
  } else if (lastWord.startsWith('[img[')) {
    sources = images;
  } else if (lastWord.startsWith(triggerType.doublecurlyBrackets)) {
    sources = getAllTiddlers(triggerType.doublecurlyBrackets);
  } else if (lastWord.startsWith(triggerType.widgetArrow)) {
    sources = widgets;
  }

  return {
    from: wordStart,
    options: sources,
    validFor
  };
}
