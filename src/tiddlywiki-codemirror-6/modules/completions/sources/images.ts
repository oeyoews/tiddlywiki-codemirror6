import { Completion } from '@codemirror/autocomplete';

const section = 'images';
const type = 'cm-image';
const delimiter = '[img[';
// TODO: add /settings to jump setup tiddler
// 如果不对 label 进行特殊处理，就要处理光标位置，自定义 app function, 灵活性较差 https://github.com/BurningTreeC/tiddlywiki-codemirror-6/blob/6ed53e8624b12cf2c09187f4f5fdcdd5960889c3/plugins/tiddlywiki-codemirror-6/engine.js#L327-L346C3
function snippets() {
  const allImageTiddlers = $tw.wiki.filterTiddlers(
    '[!is[system]is[image]]  [all[tiddlers+shadows]tag[$:/tags/Image]]'
  );

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
          let cursorEndPosition: number = from;
          const cursorPos = view.state.selection.main.head;
          if (cursorPos + delimiter.length / 2 <= doc.length) {
            cursorEndPosition =
              cursorEndPosition + title.length + delimiter.length + 2;
          } else {
            cursorEndPosition += (title + delimiter).length;
          }
          view.dispatch({
            changes: { from, to, insert: delimiter + title },
            selection: { anchor: cursorEndPosition, head: cursorEndPosition }
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
