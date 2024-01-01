import config from '../utils/config';
import { autocompletion } from '@codemirror/autocomplete';

const autocompletionConfig = () => {
  return autocompletion({
    tooltipClass: function () {
      return 'cm-autocomplete-tooltip';
    },
    selectOnOpen: config.selectOnOpen(),
    icons: config.autocompleteIcons(),
    closeOnBlur: true, // 焦点改变时关闭
    activateOnTyping: config.activateOnTyping(), // 输入时是否显示补全框。
    maxRenderedOptions: Number(config.maxRenderedOptions())
  });
};

export default autocompletionConfig;
