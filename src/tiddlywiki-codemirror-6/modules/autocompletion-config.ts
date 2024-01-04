import cmeConfig from '../cmeConfig';
import { autocompletion } from '@codemirror/autocomplete';

// addToOption 可以生成一个节点，preview tiddler
export default () =>
  autocompletion({
    tooltipClass: () => 'cm-autocomplete-tooltip',
    optionClass: () => 'cm-autocomplete-option',
    selectOnOpen: cmeConfig.selectOnOpen(),
    icons: cmeConfig.autocompleteIcons(),
    closeOnBlur: cmeConfig.closeOnBlur(), // 焦点改变时关闭
    activateOnTyping: cmeConfig.activateOnTyping(), // 输入时是否显示补全框。
    maxRenderedOptions: cmeConfig.maxRenderedOptions()
  });
