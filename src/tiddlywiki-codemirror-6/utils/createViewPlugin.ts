import {
  DecorationSet,
  ViewUpdate,
  MatchDecorator,
  ViewPlugin,
  EditorView
} from '@codemirror/view';

export default function createViewPlugin(linkDecorator: MatchDecorator) {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      // 附加到 view 上
      constructor(view: EditorView) {
        this.decorations = linkDecorator.createDeco(view);
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = linkDecorator.updateDeco(update, this.decorations);
        }
      }
    },

    { decorations: (v) => v.decorations }
  );
}
