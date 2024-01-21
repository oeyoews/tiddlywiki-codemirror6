import { tiddlywiki, tiddlywikiLanguage } from 'codemirror-lang-tiddlywiki';
import completions from '@/cm6/modules/completions';
import { html, htmlLanguage } from '@codemirror/lang-html';
import { json, jsonLanguage } from '@codemirror/lang-json';
import { css, cssLanguage } from '@codemirror/lang-css';
import { modes } from '@/cm6/config';

import { markdown, markdownLanguage } from '@codemirror/lang-markdown';

import { javascript, javascriptLanguage } from '@codemirror/lang-javascript';

import { Extension, Prec } from '@codemirror/state';
import { IWidget } from '@/cm6/types';

const dynamicmode = (
  mode: string = modes.tiddlywiki,
  cme: Extension[],
  widget: IWidget,
  self: any
) => {
  let actionCompletions;

  const options = {
    autocomplete: completions(widget, self)
  };

  // defaultCodeLanguage: markdownLanguage,
  // defaultCodeLanguage: cmeConfig.enableMarkdownJsHighlight()
  //   ? javascriptLanguage : '', // 默认为 js
  // NOTE: use language-data's languages 高亮 markdown 代码，但是插件大小会增加 1M, 这里仅仅加上常用的高亮
  // codeLanguages: languages
  switch (mode) {
    case modes.tiddlywiki:
      // @ts-expect-error
      cme.push(tiddlywiki({ base: tiddlywikiLanguage }));

      actionCompletions = tiddlywikiLanguage.data.of(options);

      break;
    case modes.markdown[0]:
    case modes.markdown[1]:
      // NOTE: 目前 tiddlywikiLanguage 还没有完成，所以目前仅仅支持 markdown 代码块
      cme.push(
        markdown({
          base: markdownLanguage,
          completeHTMLTags: true,
          // @ts-expect-error
          codeLanguages: (info: string) => {
            switch (info) {
              case 'javascript':
              case 'js':
              case 'ts':
                return javascriptLanguage;
              case 'css':
                return cssLanguage;
              case 'html':
                return htmlLanguage;
              case 'json':
                return jsonLanguage;
              case 'markdown':
              case 'md':
                return markdownLanguage;
              case 'tiddlywiki':
              case 'tw':
              case 'wiki':
                return tiddlywikiLanguage;
              default:
                break;
            }
          }
        })
      );

      actionCompletions = markdownLanguage.data.of(options);

      break;
    case modes.html:
      cme.push(html({ selfClosingTags: true }));
      break;

    case modes.javascript:
      cme.push(javascript());
      break;
    case modes.json:
      cme.push(json());
      break;
    case modes.css:
      cme.push(css());
      break;
    default:
  }

  actionCompletions && cme.push(Prec.high(actionCompletions));
};

export default dynamicmode;
