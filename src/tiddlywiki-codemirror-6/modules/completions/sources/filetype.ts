import { Completion } from '@codemirror/autocomplete';
import { IWidget } from '@/cm6/types/IWidget';
import { capitalize } from '@/cm6/utils/capitalize';
import { type IMode } from '@/cm6/config';

const section = 'filetype';
const delimiter = '//';
const type = 'cm-filetype';

const getIcontype = (text: IMode) => {
  let type: ICompletionIcons = 'keyword';
  switch (text) {
    case 'text/plain':
      type = 'cm-plain';
      break;
    case 'image/svg+xml':
      type = 'cm-svg';
      break;
    // @ts-expect-error
    case 'image/gif':
      type = 'cm-gif';
      break;
    case 'text/x-markdown':
    case 'text/markdown':
      type = 'cm-markdown';
      break;
    case 'text/vnd.tiddlywiki':
    // @ts-expect-error
    case 'text/x-tiddlywiki':
      type = 'cm-tiddlywiki';
      break;
    case 'text/css':
      type = 'cm-css';
      break;
    case 'application/javascript':
      type = 'cm-js';
      break;
    // @ts-expect-error
    case 'image/jpeg':
    // @ts-expect-error
    case 'image/png':
      type = 'cm-image';
      break;
    case 'application/json':
      type = 'cm-json';
      break;
    case 'text/html':
      type = 'cm-html';
      break;
    default:
      break;
  }
  return type;
};

function snippets(widget: IWidget) {
  const filetypes = $tw.wiki
    .filterTiddlers('[all[tiddlers+shadows]prefix[$:/language/Docs/Types/]]')
    .map((item) => ({
      title: item
        .split('/')
        .pop()!
        .replace('vnd.', '')
        .replace('x-tiddlywiki', 'tiddlywiki2'),
      text: item.replace('$:/language/Docs/Types/', '')
    }));

  /*   type IFiletypeExtensions = {
    [key: string]: {
      type: string;
    };
  };

  const filetypeExtensions: IFiletypeExtensions = $tw.config.fileExtensionInfo;
  const filetypesData = Object.entries(filetypeExtensions);
  const filetypes2 = filetypesData.map((filetype) => ({
    title: filetype[0].slice(1),
    text: filetype[1].type
  }));

  const filetypes = [...new Set(filetypes1.concat(filetypes2))];
  console.log(filetypes1.concat(filetypes2)); */

  return filetypes.map(
    (item) =>
      ({
        label: delimiter + item.title,
        displayLabel: capitalize(item.title),
        type: getIcontype(item.text as IMode),
        section,
        boost:
          item.text === 'text/markdown' || item.text === 'text/vnd.tiddlywiki'
            ? 1
            : 0,
        apply: (view, completion, from, to) => {
          view.dispatch({
            changes: { from, to, insert: '' }
          });
          // TODO: 或者使用 widget.editTitle 替换 title
          // TODO: 传入 widget
          $tw.wiki.setText(widget.editTitle, 'type', '', item.text, {
            suppressTimestamp: false
          });
        }
      }) as Completion
  );
}

export default {
  section,
  type,
  delimiter,
  snippets
};
