import { Completion } from '@codemirror/autocomplete';
import { menu } from 'src/tiddlywiki-codemirror-6/modules/config/menu';
import { capitalize } from 'src/tiddlywiki-codemirror-6/utils/capitalize';
import triggerType from 'src/tiddlywiki-codemirror-6/utils/triggerType';

export function setupSnippets() {
  const filetypes = [
    {
      title: 'setup',
      description: 'Setup Codemirror6'
    }
  ];

  return filetypes.map(
    (item) =>
      ({
        label: triggerType.setup + item.title,
        displayLabel: capitalize(item.description),
        type: 'keyword',
        section: menu.filetypes,
        apply: (view, completion, from, to) => {
          view.dispatch({
            changes: { from, to, insert: '' }
            // selection: { anchor: cursorEndPosition, head: cursorEndPosition }
          });
          $tw.wiki.setText(
            '$:/state/tab-1749438307',
            'text',
            '',
            '$:/plugins/oeyoews/tiddlywiki-codemirror-6/ui/ControlPanel/settings'
          );
          new $tw.Story().navigateTiddler('$:/ControlPanel');
        }
      }) as Completion
  );
}
