import {
  Completion,
  snippetCompletion as snip
} from '@codemirror/autocomplete';
import delimiter from '@/cm6/utils/triggerType';
import { menu } from '@/cm6/modules/config/menu';

export function widgetSnippets() {
  const modules = $tw.modules.titles; // $tw.modules.types 获取不到 widget name, 除非根据文件名
  if (!modules) return [];
  const allwidgets = Object.entries(modules)
    .filter(
      ([_, { moduleType, exports }]) =>
        moduleType === 'widget' && exports && Object.keys(exports).length > 0
    )
    // @ts-ignore
    .map(([_, { exports }]) => Object.keys(exports)[0]);

  // $tw.wiki.filterTiddlers('[[macro]modules[]]') // 根据文件名

  // https://github.com/codemirror/website/tree/master/site/examples/autocompletion
  // https://codemirror.net/docs/ref/#autocomplete
  return allwidgets.map((widget) =>
    snip(delimiter.widget + widget + ' ' + '#{0}/>#{1}', {
      label: delimiter.widget + widget,
      displayLabel: widget,
      type: 'cm-widget',
      section: menu.widgets
    } as Completion)
  );
}
