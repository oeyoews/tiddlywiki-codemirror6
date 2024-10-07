import { Completion } from '@codemirror/autocomplete';

const section = 'images';
const type = 'cm-image';
const delimiter = '[img[';
const description = 'show image';
// TODO: add /settings to jump setup tiddler
// 如果不对 label 进行特殊处理，就要处理光标位置，自定义 app function, 灵活性较差 https://github.com/BurningTreeC/tiddlywiki-codemirror-6/blob/6ed53e8624b12cf2c09187f4f5fdcdd5960889c3/plugins/tiddlywiki-codemirror-6/engine.js#L327-L346C3
function snippets() {
  // $:/core/icon 只能使用嵌入， 不能使用img 语法
  //  [all[tiddlers+shadows]tag[$:/tags/Image]!prefix[$:/core]]
  const allImageTiddlers = $tw.wiki.filterTiddlers('[!is[system]is[image]]');

  return allImageTiddlers.map(
    (title) =>
      ({
        label: delimiter + title,
        displayLabel: title,
        type,
        section,
        boost: title.startsWith('$') ? 0 : 1,
        info: () => {
          const imagePreview = document.createElement('div');
          imagePreview.className = 'cm-image-preview';
          const imageHTML = $tw.wiki.renderTiddler('text/html', title);
          imagePreview.innerHTML = imageHTML;
          return imagePreview;
        },
        apply: (view, completion, from, to) => {
          const doc = view.state.doc;
          let cursorEndPosition: number = from + (title + delimiter).length;
          const cursorPos = view.state.selection.main.head;

          if (doc.sliceString(cursorPos, cursorPos + 2) === ']]') {
            cursorEndPosition = cursorEndPosition += 2;
          }
          view.dispatch({
            changes: { from, to, insert: delimiter + title },
            selection: {
              anchor: cursorEndPosition,
              head: cursorEndPosition
            }
          });
        }
      }) as Completion
  );
}

export default {
  section,
  type,
  delimiter,
  description,
  snippets
};
