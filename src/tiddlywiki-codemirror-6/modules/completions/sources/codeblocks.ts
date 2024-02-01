import {
  snippetCompletion as snip,
  Completion
} from '@codemirror/autocomplete';
import { menu } from '@/cm6/modules/constants/menu';
import triggerType from '@/cm6/modules/constants/triggerType';

const getIcontype = (text: string) => {
  let type: ICompletionIcons = 'keyword';
  switch (text) {
    case 'js':
      type = 'cm-js';
      break;
    case 'mermaid':
      type = 'cm-mermaid';
      break;
    case 'html':
      type = 'cm-html';
      break;
    default:
      break;
  }
  return type;
};

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
          type: getIcontype(item.title),
          section: menu.codeblocks
        }
      ) as Completion
  );
}
