import { snippetCompletion as snip } from '@codemirror/autocomplete';

const section = 'mermaid';
const type = 'cm-mermaid';
const delimiter = '``';

// order 权重 排序
function snippets() {
  // if (typeof window?.mermaid) {
  //   return [];
  // }
  const tags = [
    'graph',
    'pie',
    // 'flowchart',
    'mindmap',
    'timeline',
    'sequenceDiagram',
    'classDiagram',
    'stateDiagram-v2',
    'erDiagram',
    'journey',
    'gantt',
    'requirementDiagram',
    'quadrantChart',
    'gitGraph',
    'C4Context',
    // 'zenuml',
    'xychart-beta',
    'sankey-beta',
    'block-beta',
    'packet-beta'
  ].map((item) => ({
    title: item
  }));

  const placeholder = '`'.repeat(3);

  return tags.map((item, index) =>
    snip(`${placeholder}mermaid\n${item.title}\n#{text}\n${placeholder}`, {
      label: delimiter + item.title,
      displayLabel: item.title,
      type,
      section,
      boost: index < 5 ? 1 : 0
    })
  );
}

export default {
  section,
  type,
  delimiter,
  snippets
};
