import {
  Completion,
  snippetCompletion as snip
} from '@codemirror/autocomplete';

const section = 'widget';
const type = 'cm-widget';
const delimiter = '<$';
function snippets() {
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
    snip(delimiter + widget + ' ' + '#{0}/>#{1}', {
      label: delimiter + widget,
      displayLabel: widget,
      type,
      section
    } as Completion)
  );
}

export default {
  section,
  type,
  delimiter,
  snippets
};
