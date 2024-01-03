// @ts-nocheck
import { MatchDecorator, ViewPlugin } from '@codemirror/view';

export default function createViewPlugin(linkDecorator: MatchDecorator) {
  return ViewPlugin.fromClass(
    class URLView {
      constructor(view) {
        this.decorator = linkDecorator;
        this.decorations = this.decorator.createDeco(view);
      }
      update(update) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = this.decorator.updateDeco(
            update,
            this.decorations
          );
        }
      }
    },
    { decorations: (v) => v.decorations }
  );
}
