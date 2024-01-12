import cmeConfig from '../../cmeConfig';
import { autocompletion } from '@codemirror/autocomplete';

// @see-also https://codemirror.net/docs/ref/#autocomplete.CompletionSection
export default () =>
  autocompletion({
    aboveCursor: false,
    tooltipClass: () => 'cm-autocomplete-tooltip',
    optionClass: () => 'cm-autocomplete-option',
    selectOnOpen: cmeConfig.selectOnOpen(),
    icons: cmeConfig.autocompleteIcons(),
    closeOnBlur: cmeConfig.closeOnBlur(), // 焦点改变时关闭
    activateOnTyping: cmeConfig.activateOnTyping(), // 输入时是否显示补全框。
    updateSyncTime: 100,
    interactionDelay: 75,
    // compareCompletions
    maxRenderedOptions: cmeConfig.maxRenderedOptions(),
    defaultKeymap: true
  });
