import { snippetCompletion as snip } from '@codemirror/autocomplete';
import { menu } from '@/cm6/modules/constants/menu';
import triggerType from '@/cm6/modules/constants/triggerType';

export function helpSnippets() {
  const items = Object.entries(triggerType).map(([key, value]) => ({
    title: key,
    name: value
  }));

  return items.map((item) =>
    snip(item.name, {
      section: menu.help,
      label: triggerType.help + item.title,
      detail: item.name,
      // info: item.name,
      displayLabel: item.title,
      type: 'keyword'
    })
  );
}
