import { CompletionContext } from '@codemirror/autocomplete';
import getAllWidget from '../utils/getAllWidget';
import getAllSnippets from '../utils/getAllSnippet';
// import { syntaxTree } from '@codemirror/language';

// https://codemirror.net/examples/autocompletion/
export default function widgetCompletions(context: CompletionContext) {
  const word = context.matchBefore(/\w*/); // 这种遇到短横线会消失，但是不影响多次触发同一行内
  // const word = context.matchBefore(/<\$/);
  // let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  // console.log(nodeBefore.from);
  if (!word || (word.from == word.to && !context.explicit)) return null;
  // if (word.text.length < 3) return;

  return {
    from: word.from,
    options: [
      // { label: 'hello', type: 'variable', info: '(World)' },
      // { label: 'magic', type: 'text', apply: '⠁⭒*.✩.*⭒⠁', detail: 'macro' },
      ...getAllWidget(),
      ...getAllSnippets()
    ],
    validFor: /^[\w$]*$/
  };
}
