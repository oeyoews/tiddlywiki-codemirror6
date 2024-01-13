import { Extension } from '@codemirror/state';

import { inlineSuggestion } from '../extensions/inlineSuggestion';

import { completionStatus, selectedCompletion } from '@codemirror/autocomplete';
import cm6 from '../cm6';
import { EditorView } from '@codemirror/view';

// @see-also: https://github.com/ChromeDevTools/devtools-frontend/blob/main/front_end/ui/components/text_editor/config.ts#L370
// TODO: inline suggestion is conflict for autocompletion
export default function inlineSuggestionExt(self: {
  cme: Extension[];
  cm: EditorView;
}) {
  // TODO: how to refresh
  // status wrong
  const fetchSuggestion = () => {
    const state = self.cm.state;
    const status = completionStatus(state) === 'active';
    if (!status) {
      return;
    }

    const cursorPos = state.selection.main.head;
    const doc = state.doc;

    let wordStart = cursorPos;

    while (
      wordStart > 0 &&
      /[^\s]/.test(doc.sliceString(wordStart - 1, wordStart)) // 使用 [^\s] 表示非空白字符
    ) {
      wordStart--;
    }

    // 获取光标位置前最后一个单词
    let lastWord = doc.sliceString(wordStart, cursorPos);

    // 中文是一个汉字等于两个英文字符
    if (lastWord.length < cm6.minLength() || wordStart === cursorPos) {
      return;
    }

    // 如果不开启 show completion, 就获取不到列表
    if (status) {
      // TODO: 需要细化逻辑
      // return selectedCompletion(state)?.label.slice(0, lastWord.length);
      return ' ' + selectedCompletion(state)?.displayLabel;
    }
    return '';
  };

  if (cm6.inlineSuggestion()) {
    self.cme.push(
      inlineSuggestion({
        // @ts-expect-error
        fetchFn: fetchSuggestion,
        delay: 100
      })
    );
  }
}
