import { snippetCompletion as snip } from '@codemirror/autocomplete';
import { menu } from '@/cm6/modules/constants/menu';
import triggerType from '@/cm6/modules/constants/triggerType';

// order 权重 排序
export function mermaidSnippets() {
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
      label: triggerType.mermaid + item.title,
      displayLabel: item.title,
      type: 'cm-mermaid',
      section: menu.mermaid,
      boost: index < 5 ? 1 : 0
    })
  );
}
