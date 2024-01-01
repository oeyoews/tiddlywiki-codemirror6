import { CompletionContext } from '@codemirror/autocomplete';
import getAllWidget from '../utils/getAllWidget';
// import { syntaxTree } from '@codemirror/language';

// https://codemirror.net/examples/autocompletion/
export default function widgetCompletions(context: CompletionContext) {
  // 最小补全 length
  // const word = context.matchBefore(/\w*/); // 这种遇到短横线会消失，但是不影响多次触发同一行内
  const word = context.matchBefore(/<\$/);
  // let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  // console.log(nodeBefore.from);
  if (!word || (word.from == word.to && !context.explicit)) return null;
  // if (word.text.length < 3) return;

  return {
    from: word.from,
    options: [
      {
        label: 'match',
        type: 'keyword',
        apply: '替换后的文本：match',
        detail: '详情 match(测试)'
      },
      // { label: 'hello', type: 'variable', info: '(World)' },
      // { label: 'magic', type: 'text', apply: '⠁⭒*.✩.*⭒⠁', detail: 'macro' },
      ...getAllWidget()
    ],
    validFor: /^[\w$]*$/
  };
}
