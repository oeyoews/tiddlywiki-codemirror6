import { Completion } from '@codemirror/autocomplete';
import cm6, { configBaseTitle } from '@/cm6/config';
import { menu } from '@/cm6/modules/constants/menu';
import { capitalize } from '@/cm6/utils/capitalize';
import triggerType from '@/cm6/modules/constants/triggerType';
import { IWidget } from '@/cm6/types/IWidget';
import { EditorView } from '@codemirror/view';

type IFileType<T> = {
  title: T;
  description: {
    zh: string;
    en: string;
  };
};

function defineFileType<T extends string>(filetypes: IFileType<T>[]) {
  return filetypes;
}

const filetypes = defineFileType([
  {
    title: 'use-simple-editor',
    description: {
      zh: '使用普通编辑器',
      en: 'use simple editor'
    }
  },
  {
    title: 'report-cm6-bug',
    description: {
      zh: '提交 Codemirror6 插件 BUG',
      en: 'Report Codemirror6 Bug'
    }
  },
  {
    title: 'view-source-code',
    description: {
      zh: '查看插件源码',
      en: 'View Source Code'
    }
  },
  {
    title: 'view-online-cm6-example',
    description: {
      zh: '在线查看 Codemirror6 示例',
      en: 'view online cm6 example'
    }
  },
  {
    title: 'add-new-snippets',
    description: {
      zh: '添加新的 模板片段（WIP）',
      en: 'Add New Snippet(WIP)'
    }
  },
  {
    title: 'update-codemirror6-plugin',
    description: {
      zh: '更新 Codemirror6 插件',
      en: 'update codemirror6 plugin'
    }
  },
  {
    title: 'setupCM6',
    description: {
      zh: '设置',
      en: 'Setup Codemirror6'
    }
  },
  {
    title: 'toggleMode',
    description: {
      zh: '编辑器键盘映射模式',
      en: 'Editor keymap mode'
    }
  },
  {
    title: 'toggleFullscreen',
    description: {
      zh: '编辑器全屏',
      en: 'Editor FullScreen'
    }
  },
  {
    title: 'toggleTiddlywikiFullscreen',
    description: {
      zh: '太微全屏',
      en: 'Tiddlywiki FullScreen'
    }
  }
]);

// export type IEventTypes = (typeof filetypes)[number]['title'];

export function commandSnippets(widget: IWidget) {
  const language = $tw.wiki.getTiddlerText('$:/config/codemirror6/language');

  return filetypes.map(
    (item) =>
      ({
        label: triggerType.command + item.title,
        displayLabel:
          language === 'zh'
            ? item.description.zh
            : capitalize(item.description.en),
        type: 'cm-command',
        section: menu.commands,
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
