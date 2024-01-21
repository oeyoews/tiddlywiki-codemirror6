import { snippetCompletion as snip } from '@codemirror/autocomplete';
import { menu } from '@/cm6/modules/constants/menu';
import triggerType from '@/cm6/modules/constants/triggerType';

export function mdSnippets() {
  const tags = [
    'note',
    'info',
    'todo',
    'important',
    'tip',
    'success',
    'question',
    'warning',
    'caution',
    'fail',
    'danger',
    'error',
    'bug',
    'example',
    'snippet',
    'abstract',
    'summary',
    'quote',
    'cite',
    'see-also'
  ].map((item) => ({
    title: item
  }));

  return tags.map((item) =>
    snip(`${triggerType.md}${item.title}\n#{text}\n${triggerType.md}`, {
      label: triggerType.md + item.title,
      displayLabel: item.title,
      type: 'keyword',
      section: menu.md
    })
  );
}
