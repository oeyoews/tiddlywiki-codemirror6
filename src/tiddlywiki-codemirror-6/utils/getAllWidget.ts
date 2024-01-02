// https://codemirror.net/docs/ref/#autocomplete
import { snippetCompletion as snip } from '@codemirror/autocomplete';

export default function getAllWidget() {
  const modules = $tw.modules.titles;
  const allwidgets = Object.entries(modules)
    .filter(
      ([_, { moduleType, exports }]) =>
        // @ts-expect-error
        moduleType === 'widget' && Object.keys(exports).length > 0
    )
    // @ts-ignore
    .map(([_, { exports }]) => Object.keys(exports)[0]);

  // TODO: 需要匹配 <$ 开头的
  // https://github.com/codemirror/website/tree/master/site/examples/autocompletion
  // https://codemirror.net/docs/ref/#autocomplete
  const widgetSnippets = allwidgets.map((widget) =>
    snip(`<\$${widget} \$\{0\}/>\$\{1\}`, {
      label: `<\$${widget}`, // 触发字符
      displayLabel: widget, // 显示字符
      type: 'keyword'
      // section: 'widgets'// 分组，类似 selection option group
      // detail: 'widget',
      // info: `<\$${widget} />` // TODO: 样式问题
    })
  );

  return widgetSnippets;
}
