import { CompletionContext } from '@codemirror/autocomplete';
import getAllWidget from '../utils/getAllWidget';
import getAllSnippets from '../utils/getAllSnippet';
import config from '../utils/config';
import { getAllTiddlers } from '../utils/getAllTiddlers';
import triggerType from '../utils/triggerType';
import { getAllImages } from '../utils/getAllImage';

// https://codemirror.net/examples/autocompletion/
export default function widgetCompletions(context: CompletionContext) {
  // const word = context.matchBefore(/\w*/); // 这种遇到短横线会消失，但是不影响多次触发同一行内
  // const word = context.matchBefore(/<\$/);

  const cursorPos = context.state.selection.main.head;
  const doc = context.state.doc;

  let wordStart = cursorPos;

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

  if (lastWord.startsWith(triggerType.widgetArrow)) {
    return {
      from: wordStart,
      options: [...getAllWidget()],
      validFor: /^[\w$]*$/
    };
  }

  if (lastWord.startsWith(triggerType.doubleBrackets)) {
    const options = [...getAllTiddlers(triggerType.doubleBrackets)];
    return {
      from: wordStart,
      options,
      validFor: /^[\w$]*$/
    };
  }

  if (lastWord.startsWith('[img[')) {
    const options = [...getAllImages()];
    return {
      from: wordStart,
      options,
      validFor: /^[\w$]*$/
    };
  }

  if (lastWord.startsWith(triggerType.doublecurlyBrackets)) {
    const options = [...getAllTiddlers(triggerType.doublecurlyBrackets)];
    return {
      from: wordStart,
      options,
      validFor: /^[\w$]*$/
    };
  }

  if (lastWord.length < config.minLength()) {
    return;
  }

  return {
    from: wordStart,
    options: [...getAllSnippets()],
    validFor: /^[\w$]*$/
  };
}
