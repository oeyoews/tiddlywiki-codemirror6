import { Completion } from '@codemirror/autocomplete';
import cm6, { configBaseTitle } from '@/cm6/config';
import { capitalize, useSound } from '@/cm6/utils/capitalize';
import { IWidget } from '@/cm6/types/IWidget';
import { EditorView } from '@codemirror/view';
import { zhipuStreamRequest } from '@/cm6/modules/ai/zhipu';
import { lockEditorUI, unlockEditorUI } from '@/cm6/utils/toggle';
import {
  removeInterruptButton,
  insertAcceptRejectButtons,
  insertInterruptButton
} from '@/cm6/modules/ai/buttons';

type IFileType<T> = {
  title: T;
  description: {
    zh: string;
    en: string;
  };
};

const typeList = {
  // 'text/vnd.tiddlywiki': 'tiddlywiki的wikitext',
  'text/markdown': 'markdown',
  'text/x-markdown': 'markdown'
};
const section = 'command';
const type = 'cm-command';
const delimiter = '@cmd:';
const description = 'some commands';

function defineFileType<T extends string>(filetypes: IFileType<T>[]) {
  return filetypes;
}

const filetypes = defineFileType([
  {
    title: 'ai',
    description: {
      zh: 'ai',
      en: 'ai'
    }
  },
  // todo
  {
    title: 'copy-tiddler-content',
    description: {
      zh: '复制 tiddler 内容(WIP)',
      en: 'copy current tiddler content(WIP)'
    }
  },
  // {
  //   title: 'use-simple-editor',
  //   description: {
  //     zh: '使用普通编辑器',
  //     en: 'use simple editor'
  //   }
  // },
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
      zh: '添加新的代码片段',
      en: 'Add New Snippet'
    }
  },
  {
    title: 'add-new-template',
    description: {
      zh: '添加新的模板',
      en: 'Add New Template'
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

export function snippets(widget: IWidget, _self: any) {
  const language = $tw.wiki.getTiddlerText('$:/config/codemirror6/language');

  return filetypes.map(
    (item) =>
      ({
        label: delimiter + item.title,
        displayLabel:
          language === 'zh'
            ? item.description.zh
            : capitalize(item.description.en),
        type,
        section,
        // commitCharacters: ['tiddlywiki'],
        apply: async (view: EditorView, completion: Completion, from, to) => {
          useSound();
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
            // case 'use-simple-editor':
            //   const type = widget.editType || 'text/vnd.tiddlywiki';
            //   const EDITOR_MAPPING_PREFIX = '$:/config/EditorTypeMappings/';
            //   cm6.debug() &&
            //     new $tw.Story().navigateTiddler(EDITOR_MAPPING_PREFIX + type);
            //   $tw.wiki.setText(
            //     EDITOR_MAPPING_PREFIX + type,
            //     'text',
            //     '',
            //     'text',
            //     {
            //       suppressTimestamp: true
            //     }
            //   );

            //   break;
            case 'toggleMode':
              const nextValue = cm6.keymap() === 'vim' ? 'no' : 'yes';
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
            case 'ai':
              const fields = $tw.wiki.getTiddler(widget?.editTitle!)?.fields;
              const title = fields?.['draft.title'] as string;
              const editType = fields?.['type'] as keyof typeof typeList;
              if (!editType.endsWith('markdown')) {
                return;
              }

              // 禁用用户编辑
              view.dispatch({
                effects: _self.editableCompartment.reconfigure(
                  EditorView.editable.of(false)
                )
              });
              // 禁用用户所有交互（鼠标、键盘）
              view.dispatch({
                effects: _self.blockInteractionCompartment.reconfigure(
                  EditorView.domEventHandlers({
                    mousedown: (e) => {
                      e.preventDefault();
                      return true;
                    },
                    touchstart: (e) => {
                      e.preventDefault();
                      return true;
                    },
                    keydown: (e) => {
                      e.preventDefault();
                      return true;
                    },
                    keyup: (e) => {
                      e.preventDefault();
                      return true;
                    },
                    focus: (e) => {
                      e.preventDefault();
                      return true;
                    },
                    blur: (e) => {
                      e.preventDefault();
                      return true;
                    }
                  })
                )
              });
              lockEditorUI(view);
              addMask(view);

              // 记录插入前的内容
              const beforeText = view.state.doc.toString();

              // 允许中断
              const abortController = new AbortController();
              insertInterruptButton(view, abortController, () => {
                unlockEditorUI(view);
                removeMask(view);
                view.dispatch({
                  effects: [
                    _self.blockInteractionCompartment.reconfigure(
                      EditorView.domEventHandlers({})
                    ),
                    _self.editableCompartment.reconfigure(
                      EditorView.editable.of(true)
                    )
                  ]
                });
              });

              const prompt = `根据标题生成一篇文章(${typeList['text/markdown']}语法): ${title}`;
              // TODO: 考虑并发
              await zhipuStreamRequest(
                prompt,
                (text: string) => insertTextFromCursor(view, text, true),
                () => {
                  unlockEditorUI(view);
                  removeMask(view);
                  // 合并触发， 否则block不生效
                  view.dispatch({
                    effects: [
                      _self.blockInteractionCompartment.reconfigure(
                        EditorView.domEventHandlers({})
                      ),
                      _self.editableCompartment.reconfigure(
                        EditorView.editable.of(true)
                      )
                    ]
                  });

                  // 插入“接受/拒绝”按钮
                  insertAcceptRejectButtons(view, beforeText);
                  removeInterruptButton(view);
                },
                { signal: abortController.signal }
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
                '$:/plugins/oeyoews/tiddlywiki-codemirror-6/settings'
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
            case 'add-new-template':
              widget.dispatchEvent({
                type: 'tm-new-tiddler',
                paramObject: {
                  title: '$:/templates/new'
                }
              });
              break;
            case 'add-new-snippets':
              widget.dispatchEvent({
                type: 'tm-new-tiddler',
                paramObject: {
                  title: '$:/snippets/new',
                  caption: 'New Snippet'
                }
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

export default {
  section,
  type,
  delimiter,
  description,
  snippets
};

function insertTextFromCursor(
  view: EditorView,
  text: string,
  stream = false,
  delay = 100
) {
  if (!text) return;

  const state = view.state;
  let pos = state.selection.main.head;
  let index = 0;
  if (stream) {
    view.dispatch({
      changes: { from: pos, insert: text },
      selection: { anchor: pos + text.length } // 更新光标到下一个位置
    });
  } else {
    function typeNextChar() {
      if (index < text.length) {
        view.dispatch({
          changes: { from: pos, insert: text[index] },
          selection: { anchor: pos + 1 } // 更新光标到下一个位置
        });
        pos += 1;
        index += 1;
        setTimeout(typeNextChar, delay);
      }
    }

    typeNextChar();
  }
}

function addMask(view: any) {
  const editorEl = view.dom;
  if (!editorEl.parentNode.querySelector('.editor-mask')) {
    const mask = document.createElement('div');
    mask.className = 'editor-mask';
    editorEl.parentNode.style.position = 'relative'; // 确保父容器相对定位
    editorEl.parentNode.appendChild(mask);
  }
}

function removeMask(view: any) {
  const editorEl = view.dom;
  const mask = editorEl.parentNode.querySelector('.editor-mask');
  if (mask) {
    mask.remove();
  }
}
