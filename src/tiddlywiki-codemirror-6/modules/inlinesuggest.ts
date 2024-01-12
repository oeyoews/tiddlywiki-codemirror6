import { EditorState, Extension, Prec } from '@codemirror/state';
import { inlineSuggestion } from 'codemirror-extension-inline-suggestion';

import { completionStatus, selectedCompletion } from '@codemirror/autocomplete';
import cmeConfig from '../cmeConfig';

// TODO: inline suggestion is conflict for autocompletion
export default function inlineSuggestionExt(
  state: EditorState,
  cme: Extension[]
) {
  // TODO: how to refresh
  const fetchSuggestion = () => {
    if (completionStatus(state) === 'active') {
      return selectedCompletion(state)?.label;
    }
    return ' hhh';
  };

  if (cmeConfig.inlineSuggestion()) {
    cme.push(
      inlineSuggestion({
        // @ts-expect-error
        fetchFn: fetchSuggestion,
        delay: 100
      })
    );
  }
}
