import { IMode } from '../config/index';
import { tiddlywiki, tiddlywikiLanguage } from 'lang-tiddlywiki';
import completions from '@/cm6/modules/completions';
import { html, htmlLanguage } from '@codemirror/lang-html';
import { json, jsonLanguage } from '@codemirror/lang-json';
import { css, cssLanguage } from '@codemirror/lang-css';
import cm6, { modes } from '@/cm6/config';
import { foldByIndent } from '@/cm6/modules/extensions/foldByIndent';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';

// import { StreamLanguage } from '@codemirror/language';
// import { tiddlyWiki } from '@codemirror/legacy-modes/mode/tiddlywiki';

import { javascript, javascriptLanguage } from '@codemirror/lang-javascript';
import { vue, vueLanguage } from '@codemirror/lang-vue';

import { Extension, Prec } from '@codemirror/state';
import { type IWidget } from '../types/IWidget';
import { checkboxPlugin } from './extensions/toggleBoolean';
import { markdownCheckboxPlugin } from './extensions/checkTODO';

const dynamicmode = (
  mode: IMode = modes.tiddlywiki,
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
    // case modes.mermaid:
    case modes.tiddlywiki:
      // NOTE: 不建议使用 legacymode, 和 cm6 部分功能有冲突
      // cme.push(StreamLanguage.define(tiddlyWiki));
      cm6.enableTWMode() && cme.push(tiddlywiki());

      cm6.foldByIndent() && cme.push(foldByIndent());

      actionCompletions = tiddlywikiLanguage.data.of(options);

      break;
    case modes.markdown:
    case modes.xmarkdown:
      cm6.todobox() && cme.push(markdownCheckboxPlugin);
      // cme.push(codeBlockTogglePlugin);
      // NOTE: 目前 tiddlywikiLanguage 还没有完成，所以目前仅仅支持 markdown 代码块
      cme.push(
        markdown({
          base: markdownLanguage,
          completeHTMLTags: true,
          // @ts-expect-error
          codeLanguages: (info: string) => {
            switch (info) {
              case 'vue':
                return vueLanguage;
              case 'javascript':
              case 'js':
              case 'ts':
              case 'typescript':
              case 'tsx':
              case 'jsx':
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

    // toggle js boolean value
    case modes.javascript:
      cme.push(javascript());
      cm6.checkbox() && cme.push(checkboxPlugin);
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
