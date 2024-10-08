import { bracketMatching, foldGutter } from '@codemirror/language';
import setVimKeymap from '@/cm6/modules/vimrc.js';
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
  highlightTrailingWhitespace,
  EditorView
} from '@codemirror/view';

import { vim } from '@replit/codemirror-vim';
import { oneDark } from '@codemirror/theme-one-dark';
import conf from '@/cm6/config';
import { wordCountExt } from '@/cm6/modules/extensions/wordCountExt';
import { type IWidget } from '@/cm6/types/IWidget';
import { cmkeymaps } from '@/cm6/modules/keymap';
import { linkHoverPreview } from '@/cm6/modules/extensions/wordhover';
import { linkExt } from '@/cm6/modules/extensions/linkExt';
import { tidExt } from '@/cm6/modules/extensions/tidExt';
import { imgExt } from '@/cm6/modules/extensions/imgExt';
import removeOutlineExt from './removeOutlineExt';
import rainbowBracketsWithText from './tiddlerMarkExt';
import highlightNewLine from './newLine';

export default function updateExtensions(cme: Extension[], widget: IWidget) {
  const fields = $tw.wiki.getTiddler(
    $tw.wiki.getTiddlerText('$:/palette')!
  )?.fields;
  const darkMode = fields?.['color-scheme'] === 'dark';

  // https://github.com/replit/codemirror-vim/issues/119
  // setup vim cursor style
  cme.push(
    Prec.high(
      EditorView.theme({
        '.cm-fat-cursor': {
          borderRadius: '1px',
          background: 'lightblue !important'
        },
        '&:not(.cm-focused) .cm-fat-cursor': {
          // outline: 'solid 1px lightblue !important',
          outline: 'none !important',
          background: 'none !important',
          color: 'transparent !important'
        }
      })
    )
  );

  if (conf.onedark() && darkMode) {
    cme.push(oneDark);
  } else {
    cme.push(githubLight);
  }

  if (conf.removeOutline()) {
    cme.push(removeOutlineExt);
  }

  if (widget?.editTitle?.startsWith('Draft of ')) {
    conf.linkPreview() && cme.push(linkHoverPreview);
    conf.wordCount() && cme.push(wordCountExt());
    conf.lineNumbers() && cme.push(lineNumbers());

    conf.clickable() && cme.push(linkExt, tidExt, imgExt);
    conf.highlightNewLine() && cme.push(highlightNewLine);
    cme.push(rainbowBracketsWithText());

    conf.lineNumbers() &&
      conf.foldGutter() &&
      cme.push(
        foldGutter({
          // closedText: '▶',
          // openText: '▼'
        })
      );

    conf.highlightActiveLine() &&
      cme.push(highlightActiveLineGutter(), highlightActiveLine());
    cme.push(
      placeholder(
        conf.enableCustomPlaceholder()
          ? conf.placeholder()
          : widget.editPlaceholder
      )
    );
    conf.completeAnyWord() &&
      cme.push(
        EditorState.languageData.of(() => [{ autocomplete: completeAnyWord }])
      );
  }

  if (conf.keymap() === 'vim') {
    setVimKeymap(widget);
    cme.push(Prec.high(vim())); // NOTE: not support new Comparement usage
  }
  cme.push(keymap.of([...defaultKeymap]));

  // NOTE: 优先级问题：最后放的 indent tab 优先级较低，需要使用 prec 提升
  cme.push(Prec.high(cmkeymaps(widget)));

  if (conf.indentWithTab()) {
    cme.push(keymap.of([indentWithTab]));
  }

  conf.highlightTrailingWhitespace() && cme.push(highlightTrailingWhitespace());
  conf.whitespace() && cme.push(highlightWhitespace());
  conf.closeBrackets() && cme.push(closeBrackets());
  conf.bracketMatching() && cme.push(bracketMatching());
}
