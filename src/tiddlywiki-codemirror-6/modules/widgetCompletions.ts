import { CompletionContext } from '@codemirror/autocomplete';
import getAllWidget from '../utils/getAllWidget';

export default function widgetCompletions(context: CompletionContext) {
  // 最小补全 length
  // let word = context.matchBefore(/\w*/);
  const word = context.matchBefore(/<\$/);
  if (!word) return null;
  if (word.from == word.to && !context.explicit) return null;
  // const words = context.matchBefore(/<\$/);
  // console.log(words);

  return {
    from: word.from,
    options: [
      // { label: 'match', type: 'keyword' },
      // { label: 'hello', type: 'variable', info: '(World)' },
      // { label: 'magic', type: 'text', apply: '⠁⭒*.✩.*⭒⠁', detail: 'macro' },
      ...getAllWidget()
    ],
    span: /^[\w$]*$/
  };
}
