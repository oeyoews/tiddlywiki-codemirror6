import {
  Completion,
  CompletionContext,
  CompletionResult
} from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import cm6 from '@/cm6/config';
import { IWidget } from '@/cm6/types/IWidget';
import { EditorView } from '@codemirror/view';
import { defaultSnippets, delimiters, getSnippets } from './sources';

// TODO: use ifIn to better completion.
// @see-also: https://github.com/codemirror/lang-javascript/blob/4dcee95aee9386fd2c8ad55f93e587b39d968489/src/complete.ts
// https://codemirror.net/examples/autocompletion/
// maybe help: https://github.com/Gk0Wk/TW5-CodeMirror-Enhanced/blob/811760507bfcd5493df4d5c117d33d7bfa076ab2/src/cme/addon/hint/hint-tw5-tiddler.ts#L58
// IME: https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event
//  https://codemirror.net/docs/migration/
export default (widget: IWidget, self: any) => {
  return (context: CompletionContext): CompletionResult | undefined => {
    const cm: EditorView = self.editor;

    if (cm?.composing) {
      return;
    }

    const nodeBefore = syntaxTree(context.state).resolveInner(context.pos);
    if (!cm6.commentComplete()) {
      if (
        nodeBefore.name === 'LineComment' ||
        nodeBefore.name === 'CommentBlock'
      ) {
        return;
      }
    }
    let validFor: RegExp = /^[\w$]*$/;

    // ifNotIn(context ); // TODO: disable completion in comment node
    const cursorPos = context.state.selection.main.head;
    const doc = context.state.doc;

    let wordStart: number = cursorPos;

    while (
      wordStart > 0 &&
      /[^\s]/.test(doc.sliceString(wordStart - 1, wordStart)) // 使用 [^\s] 表示非空白字符
    ) {
      wordStart--;
    }

    // 获取光标位置前最后一个单词
    let lastWord = doc.sliceString(wordStart, cursorPos);

    function checkFieldStart(word: string) {
      const brackets = [
        '(',
        '[',
        '{',
        '<',
        "'",
        '"',
        '`',
        '“',
        '”',
        '‘',
        '’',
        '$'
      ];
      if (
        brackets.some((item) => word.includes(item)) ||
        // brackets.includes(word) ||
        word.startsWith('https:') ||
        word.startsWith('http:') ||
        delimiters.some((item) => word.startsWith(item))
      ) {
        return false;
      }
      // ：
      // const regex =
      //   /^@[a-zA-Z0-9_-\u4e00-\u9fa5]+[:][a-zA-Z0-9_-\u4e00-\u9fa5]+$/;
      const regex = /[^\s]+[:][^\s]+$/;

      return regex.test(word);
    }
    // TODO: 退格键触发，https://discuss.codemirror.net/t/autocomplete-trigger-on-backspace/3636
    // https://discuss.codemirror.net/t/codemirror6-delete-the-word-or-move-the-cursor-to-pop-up-the-autocomplete-hint/7047
    if (lastWord.length < cm6.minLength() || wordStart === cursorPos) {
      //  closeCompletion(context);
      return;
    }

    let options: Completion[] = defaultSnippets.snippets();
    if (delimiters.some((item) => lastWord.startsWith(item))) {
      options = getSnippets(lastWord)!.snippets(widget);
      // console.log(options);
    }

    if (checkFieldStart(lastWord)) {
      options = [
        {
          label: lastWord,
          displayLabel: '回车确认',
          type: 'cm-field',
          apply: (view, completion, from, to) => {
            view.dispatch({
              changes: { from, to, insert: '' }
            });
            const fieldObj = lastWord.replace('@', '').split(':');

            const actionString = (tiddler: string, field: string[]) =>
              `<$action-setfield $tiddler="${tiddler}" ${field[0]}="${field[1]}" />`;

            $tw.rootWidget.invokeActionString(
              actionString(widget.editTitle, fieldObj)
            );
          }
        }
      ];
    }

    return {
      from: wordStart,
      options, // NOTE: 一定要保证是数组
      filter: true,
      getMatch: (compltion: Completion, matched) => {
        // if (!cm6.matchText()) return [];
        return matched as [];
      },
      validFor
    };
  };
};
