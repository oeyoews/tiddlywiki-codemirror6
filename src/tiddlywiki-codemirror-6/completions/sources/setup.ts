import { Completion } from '@codemirror/autocomplete';
import cm6, { configBaseTitle } from 'src/tiddlywiki-codemirror-6/cm6';
import { menu } from 'src/tiddlywiki-codemirror-6/modules/config/menu';
import { capitalize } from 'src/tiddlywiki-codemirror-6/utils/capitalize';
import triggerType from 'src/tiddlywiki-codemirror-6/utils/triggerType';

export function setupSnippets() {
  const filetypes = [
    {
      title: 'setupCM6',
      description: 'Setup Codemirror6'
    },
    {
      title: 'toggleMode',
      description: 'toggle editor keymap mode'
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
          switch (true) {
            case item.title === 'toggleMode':
              const nextValue = cm6.vimmode() ? 'no' : 'yes';
              $tw.wiki.setText(
                configBaseTitle + 'vimmode',
                'text',
                '',
                nextValue,
                {
                  suppressTimestamp: true
                }
              );
              break;
            case item.title === 'setupCM6':
              $tw.wiki.setText(
                '$:/state/tab-1749438307',
                'text',
                '',
                '$:/plugins/oeyoews/tiddlywiki-codemirror-6/ui/ControlPanel/settings'
              );
              new $tw.Story().navigateTiddler('$:/ControlPanel');
              break;
            default:
              break;
          }
        }
      }) as Completion
  );
}
