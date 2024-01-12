import { Extension } from '@codemirror/state';
import { inlineSuggestion } from 'codemirror-extension-inline-suggestion';

import { completionStatus, selectedCompletion } from '@codemirror/autocomplete';
import cmeConfig from '../cmeConfig';
import { EditorView } from '@codemirror/view';

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

    // TODO: 需要细化逻辑
    return selectedCompletion(state)?.label;
  };

  if (cmeConfig.inlineSuggestion()) {
    self.cme.push(
      inlineSuggestion({
        // @ts-expect-error
        fetchFn: fetchSuggestion,
        delay: 100
      })
    );
  }
}
