import cmeConfig from '../cmeConfig';
import { autocompletion } from '@codemirror/autocomplete';

const autocompletionConfig = () => {
  return autocompletion({
    tooltipClass: function () {
      return 'cm-autocomplete-tooltip';
    },
    selectOnOpen: cmeConfig.selectOnOpen(),
    icons: cmeConfig.autocompleteIcons(),
    closeOnBlur: cmeConfig.closeOnBlur(), // 焦点改变时关闭
    activateOnTyping: cmeConfig.activateOnTyping(), // 输入时是否显示补全框。
    maxRenderedOptions: cmeConfig.maxRenderedOptions()
  });
};

export default autocompletionConfig;
