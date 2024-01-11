import { bracketMatching, foldGutter } from '@codemirror/language';
import setVimKeymap from 'src/tiddlywiki-codemirror-6/utils/vimrc.js';
import { EditorState, Extension, Prec } from '@codemirror/state';
import { githubLight } from '@uiw/codemirror-theme-github';

import {
  completeAnyWord,
  closeBrackets,
  completionKeymap
} from '@codemirror/autocomplete';

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
import conf from 'src/tiddlywiki-codemirror-6/cmeConfig';
import { wordCountExt } from 'src/tiddlywiki-codemirror-6/extensions/wordCountExt';
import { type IWidget } from 'src/tiddlywiki-codemirror-6/types';
import { cmkeymaps } from '../keymap';

export default function configExtensions(cme: Extension[], widget: IWidget) {
  const fields = $tw.wiki.getTiddler($tw.wiki.getTiddlerText('$:/palette')!)
    ?.fields;
  const darkMode = fields?.['color-scheme'] === 'dark';

  (conf.enableOneDarkTheme() && darkMode && cme.push(oneDark)) ||
    cme.push(githubLight);

  // DEBUG
  if (widget?.editTitle?.startsWith('Draft of ')) {
    conf.enableWordCount() && cme.push(wordCountExt());
    conf.lineNumbers() && cme.push(lineNumbers());

    if (conf.vimmode()) {
      setVimKeymap(widget);
      cme.push(Prec.high(vim())); // 不支持 new Comparement
    }
    cme.push(keymap.of([...defaultKeymap]));

    conf.lineNumbers() && conf.foldGutter() && cme.push(foldGutter());

    conf.highlightActiveLine() &&
      cme.push(highlightActiveLineGutter(), highlightActiveLine());
    cme.push(
      placeholder(
        conf.customPlaceholder() ? conf.placeholder() : widget.editPlaceholder
      )
    );
    conf.completeAnyWord() &&
      cme.push(
        EditorState.languageData.of(() => [{ autocomplete: completeAnyWord }])
      );
  }

  if (conf.indentWithTab()) {
    cme.push(keymap.of([indentWithTab]));
  }

  // 优先级问题：最后放的 indent tab 优先级较低，需要使用 prec 提升
  cme.push(Prec.highest(cmkeymaps));

  conf.highlightTrailingWhitespace() && cme.push(highlightTrailingWhitespace());
  conf.highlightWhitespace() && cme.push(highlightWhitespace());
  conf.closeBrackets() && cme.push(closeBrackets());
  conf.bracketMatching() && cme.push(bracketMatching());
}
