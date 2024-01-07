import { bracketMatching, foldGutter } from '@codemirror/language';
import setVimKeymap from 'src/tiddlywiki-codemirror-6/utils/vimrc.js';
import { EditorState } from '@codemirror/state';
import { githubLight } from '@uiw/codemirror-theme-github';

import { completeAnyWord, closeBrackets } from '@codemirror/autocomplete';

import { defaultKeymap, indentWithTab } from '@codemirror/commands';

import {
  keymap,
  highlightActiveLine,
  lineNumbers,
  highlightActiveLineGutter,
  placeholder,
  highlightWhitespace,
  highlightTrailingWhitespace
} from '@codemirror/view';

import { vim } from '@replit/codemirror-vim';
import { oneDark } from '@codemirror/theme-one-dark';
import cmeConfig from 'src/tiddlywiki-codemirror-6/cmeConfig';
import { wordCountExt } from 'src/tiddlywiki-codemirror-6/extensions/wordCountExt';

export default function configExtensions(cme: any[]) {
  const { fields = {} } =
    // @ts-ignore
    $tw.wiki.getTiddler($tw.wiki.getTiddlerText('$:/palette')) || {};
  // @ts-ignore
  const darkMode = fields?.['color-scheme'] === 'dark';

  (cmeConfig.enableOneDarkTheme() && darkMode && cme.push(oneDark)) ||
    cme.push(githubLight);

  if (cmeConfig.indentWithTab()) {
    cme.push(keymap.of([indentWithTab]));
  }

  if (cmeConfig.vimmode()) {
    setVimKeymap();
    cme.push(vim());
  } else {
    cme.push(keymap.of([...defaultKeymap]));
  }

  cmeConfig.completeAnyWord() &&
    cme.push(
      EditorState.languageData.of(() => [{ autocomplete: completeAnyWord }])
    );

  cmeConfig.enableWordCount() && cme.push(wordCountExt());
  cmeConfig.highlightTrailingWhitespace() &&
    cme.push(highlightTrailingWhitespace());
  cmeConfig.highlightWhitespace() && cme.push(highlightWhitespace());
  cmeConfig.closeBrackets() && cme.push(closeBrackets());
  cmeConfig.bracketMatching() && cme.push(bracketMatching());
  cmeConfig.lineNumbers() && cme.push(lineNumbers());
  cmeConfig.lineNumbers() && cmeConfig.foldGutter() && cme.push(foldGutter());
  cmeConfig.highlightActiveLine() &&
    cme.push(highlightActiveLineGutter(), highlightActiveLine());

  cme.push(placeholder(cmeConfig.placeholder()));
}
