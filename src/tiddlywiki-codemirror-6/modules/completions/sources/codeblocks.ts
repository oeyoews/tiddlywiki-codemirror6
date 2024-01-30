import {
  snippetCompletion as snip,
  Completion
} from '@codemirror/autocomplete';
import { menu } from '@/cm6/modules/constants/menu';
import triggerType from '@/cm6/modules/constants/triggerType';

export function codeblocksSnippets() {
  const types = ['js', 'mermaid', 'html'];
  const cblTypes = types.map((item) => ({
    title: item
  }));

  return cblTypes.map(
    (item) =>
      snip(
        triggerType.codeblocks +
          `${item.title}\n#{1}\n` +
          triggerType.codeblocks,
        {
          label: triggerType.codeblocks + item.title,
          displayLabel: item.title,
          type: 'keyword',
          section: menu.codeblocks
        }
      ) as Completion
  );
}
