import { EditorState } from '@codemirror/state';
import cm6 from '@/cm6/config';
import {
  autocompletion,
  Completion,
  selectedCompletion
} from '@codemirror/autocomplete';

// @see-also https://codemirror.net/docs/ref/#autocomplete.CompletionSection
export default () =>
  autocompletion({
    aboveCursor: false,
    tooltipClass: (state: EditorState): string => {
      return 'cm-autocomplete-tooltip';
    },
    optionClass: (option: Completion): string => {
      return 'cm-autocomplete-option'; // 补全选中的样式
    },

    // https://github.com/codemirror/dev/issues/1293
    // @NOTE: 这将会导致dislable 也会高亮下划线
    addToOptions: [
      {
        render: (completion: Completion, state: EditorState) => {
          const caret = document.createElement('span');
          caret.className = 'cm-autocomplete-tab';
          // if (selectedCompletion(state) !== completion) return caret;
          // caret.style.backgroundColor = 'yellow';
          caret.textContent = 'tab';
          return caret;
        },
        position: 81
      }
    ],
    // positionInfo
    selectOnOpen: cm6.selectOnOpen(),
    icons: cm6.autocompleteIcons(),
    closeOnBlur: cm6.closeOnBlur(), // 焦点改变时关闭
    activateOnTyping: cm6.activateOnTyping(), // 输入时是否显示补全框。
    updateSyncTime: 100,
    interactionDelay: 75,
    // compareCompletions
    maxRenderedOptions: cm6.maxRenderedOptions(),
    defaultKeymap: true
  });
