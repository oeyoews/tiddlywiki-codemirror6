// get all user templates to set current tiddler
// add new snippet
import { Completion } from '@codemirror/autocomplete';
import cm6, { configBaseTitle } from '@/cm6/config';
import { IWidget } from '@/cm6/types/IWidget';
import { EditorView } from '@codemirror/view';

const items = [
  {
    title: ''
  }
];

// export type IEventTypes = (typeof filetypes)[number]['title'];

const section = 'template';
const type = 'cm-template';
const delimiter = '/t';

export function commandSnippets(widget: IWidget) {
  return items.map(
    (item) =>
      ({
        section,
        label: delimiter + item.title,
        type,
        apply: (view: EditorView, completion: Completion, from, to) => {
          view.dispatch({
            changes: { from, to, insert: '' }
            // selection: { anchor: cursorEndPosition, head: cursorEndPosition }
          });
          switch (item.title) {
            /*             case item.title === 'add-new-snippets':
              const title = $tw.wiki.generateNewTitle('new-snippet', {
                // prefix: ''
              });
              break; */
            case 'use-simple-editor':
              const type = widget.editType || 'text/vnd.tiddlywiki';
              const EDITOR_MAPPING_PREFIX = '$:/config/EditorTypeMappings/';
              cm6.debug() &&
                new $tw.Story().navigateTiddler(EDITOR_MAPPING_PREFIX + type);
              $tw.wiki.setText(
                EDITOR_MAPPING_PREFIX + type,
                'text',
                '',
                'text',
                {
                  suppressTimestamp: true
                }
              );

              break;
            case 'toggleMode':
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
            case 'setupCM6':
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
            case 'update-codemirror6-plugin':
              const pluginPageTiddler =
                '$:/core/ui/ControlPanel/Modals/AddPlugins';
              $tw.wiki.setText(
                '$:/state/addplugins/tab-1342078386',
                'text',
                '',
                '$:/Library/Codemirror6'
              );
              $tw.modal.display(pluginPageTiddler);
              break;
            case 'toggleFullscreen':
              const stateTitle = `$:/state/codemirror-6/fullscreen/${widget.editTitle}`;
              const oldFullscreenValue = $tw.wiki.getTiddlerText(stateTitle);
              const newFullscreenValue =
                oldFullscreenValue === 'yes' ? 'no' : 'yes';
              $tw.wiki.setText(stateTitle, 'text', '', newFullscreenValue);
              break;
            case 'report-cm6-bug':
              const bugLink =
                'https://github.com/oeyoews/tiddlywiki-codemirror6/issues/new';
              $tw.rootWidget.dispatchEvent({
                type: 'tm-open-external-window',
                param: bugLink
              });
              break;
            case 'view-online-cm6-example':
              const demoLink =
                'https://tiddlywiki-codemirror6.vercel.app/#%24%3A%2Fplugins%2Foeyoews%2Ftiddlywiki-codemirror-6';
              $tw.rootWidget.dispatchEvent({
                type: 'tm-open-external-window',
                param: demoLink
              });
              break;
            case 'add-new-snippets':
              $tw.rootWidget.dispatchEvent({
                type: 'tm-modal',
                param: 'AddSnippets'
              });
              break;
            case 'toggleTiddlywikiFullscreen':
              $tw.rootWidget.dispatchEvent({
                type: 'tm-full-screen'
              });
              break;
            case 'view-source-code':
              const repoLink =
                'https://github.com/oeyoews/tiddlywiki-codemirror6';
              $tw.rootWidget.dispatchEvent({
                type: 'tm-open-external-window',
                param: repoLink
              });
              break;
            default:
              break;
          }
        }
      }) as Completion
  );
}
