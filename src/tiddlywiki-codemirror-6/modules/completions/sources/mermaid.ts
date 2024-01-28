import {
  snippetCompletion as snip,
  Completion
} from '@codemirror/autocomplete';
import { modes } from '@/cm6/config';
import { menu } from '@/cm6/modules/constants/menu';
import { IWidget } from '@/cm6/types/IWidget';
import triggerType from '@/cm6/modules/constants/triggerType';

export function mermaidSnippets(widget: IWidget) {
  if (widget.editType !== modes.mermaid) return [];
  const types = [
    'flowchart',
    'graph',
    'sequenceDiagram',
    'classDiagram',
    'stateDiagram-v2',
    'erDiagram',
    'journey',
    'gantt',
    'pie',
    // 'quadrantChart',
    'requirementDiagram',
    'gitGraph',
    'C4Context',
    'timeline',
    'zenuml',
    'xychart-beta'
    // 'mindmap'
  ];
  const mermaidTypes = types.map((item) => ({
    title: item
  }));

  return mermaidTypes.map(
    (item) =>
      snip(`${item.title}\n#{1}`, {
        label: triggerType.mermaid + item.title,
        displayLabel: item.title,
        type: 'keyword',
        section: menu.mermaid
      }) as Completion
  );
}
