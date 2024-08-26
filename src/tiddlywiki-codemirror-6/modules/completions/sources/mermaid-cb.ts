import { snippetCompletion as snip } from '@codemirror/autocomplete';
import { menu } from '@/cm6/modules/constants/menu';
import triggerType from '@/cm6/modules/constants/triggerType';

// order 权重 排序
export function mermaidSnippets() {
  const tags = [
    'graph',
    'flowchart',
    'sequenceDiagram',
    'classDiagram',
    'stateDiagram-v2',
    'erDiagram',
    'journey',
    'gantt',
    'pie',
    'requirementDiagram',
    'quadrantChart',
    'gitGraph',
    'C4Context',
    'timeline',
    // 'zenuml',
    'xychart-beta',
    'mindmap',
    'sankey-beta',
    'block-beta',
    'packet-beta'
  ].map((item) => ({
    title: item
  }));

  const placeholder = '`'.repeat(3);

  return tags.map((item) =>
    snip(`${placeholder}mermaid\n${item.title}\n#{text}\n${placeholder}`, {
      label: triggerType.mermaid + item.title,
      displayLabel: item.title,
      type: 'keyword',
      section: menu.mermaid
    })
  );
}
