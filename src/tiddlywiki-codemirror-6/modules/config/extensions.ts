import { bracketMatching, foldGutter } from '@codemirror/language';
import setVimKeymap from 'src/tiddlywiki-codemirror-6/utils/vimrc.js';
import { EditorState, Extension, Prec } from '@codemirror/state';
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
import conf from 'src/tiddlywiki-codemirror-6/cm6';
import { wordCountExt } from 'src/tiddlywiki-codemirror-6/extensions/wordCountExt';
import { type IWidget } from 'src/tiddlywiki-codemirror-6/types';
import { cmkeymaps } from '@/cm6/modules/keymap';
import { linkHoverPreview } from 'src/tiddlywiki-codemirror-6/extensions/wordhover';
import { linkExt } from 'src/tiddlywiki-codemirror-6/extensions/linkExt';
import { tidExt } from 'src/tiddlywiki-codemirror-6/extensions/tidExt';
import { imgExt } from 'src/tiddlywiki-codemirror-6/extensions/imgExt';
import {
  contentIncludingHint,
  showCompletionHint
} from 'src/tiddlywiki-codemirror-6/extensions/showCompletionHint';

export default function updateExtensions(cme: Extension[], widget: IWidget) {
  const fields = $tw.wiki.getTiddler(
    $tw.wiki.getTiddlerText('$:/palette')!
  )?.fields;
  const darkMode = fields?.['color-scheme'] === 'dark';

  (conf.onedark() && darkMode && cme.push(oneDark)) || cme.push(githubLight);

  if (widget?.editTitle?.startsWith('Draft of ')) {
    conf.linkPreview() && cme.push(linkHoverPreview);
    conf.wordCount() && cme.push(wordCountExt());
    conf.lineNumbers() && cme.push(lineNumbers());

    // cme.push(contentIncludingHint());

    conf.clickable() && cme.push(linkExt, tidExt, imgExt);

    if (conf.vimmode()) {
      setVimKeymap(widget);
      cme.push(Prec.high(vim())); // NOTE: not support new Comparement usage
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

  // NOTE: 优先级问题：最后放的 indent tab 优先级较低，需要使用 prec 提升
  cme.push(Prec.high(cmkeymaps));

  if (conf.indentWithTab()) {
    cme.push(keymap.of([indentWithTab]));
  }

  conf.highlightTrailingWhitespace() && cme.push(highlightTrailingWhitespace());
  conf.whitespace() && cme.push(highlightWhitespace());
  conf.closeBrackets() && cme.push(closeBrackets());
  conf.bracketMatching() && cme.push(bracketMatching());
}
