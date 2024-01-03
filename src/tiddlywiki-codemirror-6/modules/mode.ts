// @ts-nocheck

import { keymap } from '@codemirror/view';
import { tiddlywiki, tiddlywikiLanguage } from 'codemirror-lang-tiddlywiki';
import completions from './completions';
import { html, htmlLanguage } from '@codemirror/lang-html';
import { json, jsonLanguage } from '@codemirror/lang-json';
import { css, cssLanguage } from '@codemirror/lang-css';

import {
  markdown,
  markdownLanguage,
  markdownKeymap
} from '@codemirror/lang-markdown';

import { javascript, javascriptLanguage } from '@codemirror/lang-javascript';

import { Prec } from '@codemirror/state';

export default function dynamicmode(mode: string, cme: []) {
  let actionCompletions;
  if (mode === '') {
    mode = 'text/vnd.tiddlywiki';
  }

  switch (mode) {
    case 'text/vnd.tiddlywiki':
      cme.push(tiddlywiki({ base: tiddlywikiLanguage }));

      actionCompletions = tiddlywikiLanguage.data.of({
        autocomplete: completions
      });

      cme.push(Prec.high(actionCompletions));
      break;
    case 'text/markdown':
    case 'text/x-markdown':
      cme.push(markdown({ base: markdownLanguage }));

      actionCompletions = markdownLanguage.data.of({
        autocomplete: completions
      });

      cme.push(Prec.high(actionCompletions));
      cme.push(Prec.high(keymap.of(markdownKeymap)));
      break;
    case 'text/html':
      cme.push(html({ selfClosingTags: true }));
      actionCompletions = htmlLanguage.data.of({});
      cme.push(Prec.high(actionCompletions));
      break;

    case 'application/javascript':
      cme.push(javascript());
      actionCompletions = javascriptLanguage.data.of({});
      cme.push(Prec.high(actionCompletions));
      // editorExtensions.push(
      // 		javascriptLanguage.data.of({
      // 			autocomplete: scopeCompletionSource(globalThis)
      // 		})
      // 	);
      break;
    case 'application/json':
      cme.push(json());
      actionCompletions = jsonLanguage.data.of({});
      cme.push(Prec.high(actionCompletions));
      break;
    case 'text/css':
      cme.push(css());
      actionCompletions = cssLanguage.data.of({});
      cme.push(Prec.high(actionCompletions));
      break;
    default:
  }
}
