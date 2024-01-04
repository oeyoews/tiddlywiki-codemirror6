// @ts-nocheck

// https://codemirror.net/docs/ref/#autocomplete
import { snippetCompletion as snip } from '@codemirror/autocomplete';

export function getAllWidget() {
  const modules = $tw.modules.titles;
  if (!modules) return [];
  const allwidgets = Object.entries(modules)
    .filter(
      ([_, { moduleType, exports }]) =>
        moduleType === 'widget' && exports && Object.keys(exports).length > 0
    )
    .map(([_, { exports }]) => Object.keys(exports)[0]);

  // https://github.com/codemirror/website/tree/master/site/examples/autocompletion
  // https://codemirror.net/docs/ref/#autocomplete
  return allwidgets.map((widget) =>
    snip(`<\$${widget} \$\{0\}/>\$\{1\}`, {
      label: `<\$${widget}`, // 触发字符
      displayLabel: widget, // 显示字符
      type: 'keyword'
      // section: 'widgets'// 分组，类似 selection option group
      // detail: 'widget',
      // info: `<\$${widget} />` // TODO: 样式问题
    })
  );
}

export const widgets = getAllWidget();
