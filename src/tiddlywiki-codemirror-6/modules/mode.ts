import cmeConfig from '../cmeConfig.js';
import { linkExt } from '../extensions/linkExt.js';
import { tidExt } from '../extensions/tidExt.js';
import { imgExt } from '../extensions/imgExt.js';
import { color } from '@uiw/codemirror-extensions-color';
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

import { Extension, Prec } from '@codemirror/state';

const dynamicmode = (mode: string, cme: Extension[]) => {
  let actionCompletions;
  if (mode === '') {
    mode = 'text/vnd.tiddlywiki';
  }

  switch (mode) {
    case 'text/vnd.tiddlywiki':
      // @ts-expect-error
      cme.push(tiddlywiki({ base: tiddlywikiLanguage }));

      actionCompletions = tiddlywikiLanguage.data.of({
        autocomplete: completions
      });

      // cmeConfig.clickable() && cme.push(linkExt, tidExt, imgExt);
      cme.push(Prec.high(actionCompletions));
      break;
    // case 'text/markdown':
    // case 'text/x-markdown':
    //   // NOTE: 目前 tiddlywikiLanguage 还没有完成，所以目前仅仅支持 markdown 代码块
    //   cme.push(
    //     markdown({
    //       base: markdownLanguage,
    //       completeHTMLTags: true,
    //       // defaultCodeLanguage: markdownLanguage,
    //       // defaultCodeLanguage: cmeConfig.enableMarkdownJsHighlight()
    //       //   ? javascriptLanguage : '', // 默认为 js
    //       // NOTE: use language-data's languages 高亮 markdown 代码，但是插件大小会增加 1M, 这里仅仅加上常用的高亮
    //       // codeLanguages: languages
    //       // @ts-expect-error
    //       codeLanguages: (info) => {
    //         switch (info) {
    //           // case 'javascript':
    //           // case 'js':
    //           //   return javascriptLanguage;
    //           // case 'css':
    //           //   return cssLanguage;
    //           // case 'html':
    //           //   return htmlLanguage;
    //           // case 'json':
    //           //   return jsonLanguage;
    //           case 'markdown':
    //           case 'md':
    //             return markdownLanguage;
    //           case 'tiddlywiki':
    //           case 'tw':
    //           case 'wiki':
    //             return tiddlywikiLanguage;
    //           default:
    //         }
    //       }
    //     })
    //   );

    //   actionCompletions = markdownLanguage.data.of({
    //     autocomplete: completions
    //   });

    //   cmeConfig.clickable() && cme.push(linkExt, tidExt, imgExt);
    //   cme.push(Prec.high(actionCompletions));
    //   cme.push(Prec.high(keymap.of(markdownKeymap)));
    //   break;
    // case 'text/html':
    //   cme.push(html({ selfClosingTags: true }));
    //   actionCompletions = htmlLanguage.data.of({});
    //   cme.push(Prec.high(actionCompletions));
    //   break;

    // case 'application/javascript':
    //   cme.push(javascript());
    //   actionCompletions = javascriptLanguage.data.of({});
    //   cme.push(Prec.high(actionCompletions));
    //   break;
    // case 'application/json':
    //   cme.push(json());
    //   actionCompletions = jsonLanguage.data.of({});
    //   cme.push(Prec.high(actionCompletions));
    //   break;
    // case 'text/css':
    //   cme.push(css());
    //   actionCompletions = cssLanguage.data.of({});
    //   // cme.push(Prec.high(actionCompletions), color);
    //   break;
    default:
      break;
  }
};

export default dynamicmode;
