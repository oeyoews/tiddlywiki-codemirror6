import { Completion } from '@codemirror/autocomplete';
import cm6, { configBaseTitle } from '@/cm6/config';
import { menu } from '@/cm6/modules/constants/menu';
import { capitalize } from '@/cm6/utils/capitalize';
import triggerType from '@/cm6/modules/constants/triggerType';
import { IWidget } from '@/cm6/types';

export function setupSnippets(widget: IWidget) {
  const filetypes = [
    {
      title: 'setupCM6',
      description: 'Setup Codemirror6'
    },
    {
      title: 'toggleMode',
      description: 'Editor keymap mode'
    },
    {
      title: 'toggleFullscreen',
      description: 'Editor FullScreen'
    },
    {
      title: 'toggleTiddlywikiFullscreen',
      description: 'Tiddlywiki FullScreen'
    }
  ] as const;

  // type IEventTypes = (typeof filetypes)[number]['title'];

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
              /*               $tw.wiki.setText(
                '$:/state/tab-1749438307',
                'text',
                '',
                '$:/plugins/oeyoews/tiddlywiki-codemirror-6/ui/ControlPanel/settings'
              );
              new $tw.Story().navigateTiddler('$:/ControlPanel'); */
              $tw.modal.display(
                '$:/plugins/oeyoews/tiddlywiki-codemirror-6/ui/ControlPanel/settings'
              );
              break;
            case item.title === 'toggleFullscreen':
              const stateTitle = `$:/state/codemirror-6/fullscreen/${widget.editTitle}`;
              const oldFullscreenValue = $tw.wiki.getTiddlerText(stateTitle);
              const newFullscreenValue =
                oldFullscreenValue === 'yes' ? 'no' : 'yes';
              $tw.wiki.setText(stateTitle, 'text', '', newFullscreenValue);
              console.log(
                widget.editTitle,
                oldFullscreenValue,
                newFullscreenValue
              );
              break;
            case item.title === 'toggleTiddlywikiFullscreen':
              $tw.rootWidget.dispatchEvent({
                type: 'tm-full-screen'
              });
              break;
            default:
              break;
          }
        }
      }) as Completion
  );
}
