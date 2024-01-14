import cm6 from '../../cm6';
import { autocompletion } from '@codemirror/autocomplete';

// @see-also https://codemirror.net/docs/ref/#autocomplete.CompletionSection
export default () =>
  autocompletion({
    aboveCursor: false,
    tooltipClass: () => 'cm-autocomplete-tooltip',
    optionClass: () => 'cm-autocomplete-option',
    // TODO add tab node
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
