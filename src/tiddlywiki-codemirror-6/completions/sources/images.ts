import { menu } from '@/cm6/modules/config/menu';
import { Completion } from '@codemirror/autocomplete';
import triggerType from '@/cm6/utils/triggerType';

// TODO: add /settings to jump setup tiddler
// 如果不对 label 进行特殊处理，就要处理光标位置，自定义 app function, 灵活性较差 https://github.com/BurningTreeC/tiddlywiki-codemirror-6/blob/6ed53e8624b12cf2c09187f4f5fdcdd5960889c3/plugins/tiddlywiki-codemirror-6/engine.js#L327-L346C3
export function imageSnippets() {
  const allImageTiddlers = $tw.wiki.filterTiddlers(
    '[!is[system]is[image]]  [all[tiddlers+shadows]tag[$:/tags/Image]]'
  );

  return allImageTiddlers.map(
    (title) =>
      ({
        label: triggerType.img + title,
        displayLabel: title,
        type: 'cm-image',
        section: menu.images,
        boost: title.startsWith('$') ? 0 : 1,
        info: () => {
          const imagePreview = document.createElement('div');
          imagePreview.className = 'cm-image-preview';
          const imageHTML = $tw.wiki.renderTiddler('text/html', title);
          imagePreview.innerHTML = imageHTML;
          return imagePreview;
        },
        apply: (view, completion, from, to) => {
          const cursorEndPosition = from + (triggerType.img + title).length + 2;
          view.dispatch({
            changes: { from, to, insert: triggerType.img + title },
            selection: { anchor: cursorEndPosition, head: cursorEndPosition }
          });
        }
      }) as Completion
  );
}
