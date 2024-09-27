//@ts-nocheck
import { EditorView, Decoration, ViewPlugin } from '@codemirror/view';

// [[xxx]] 添加样式
const rainbowBracketsPlugin = ViewPlugin.fromClass(
  class {
    decorations;

    constructor(view) {
      this.decorations = this.getBracketDecorations(view);
    }

    update(update) {
      if (update.docChanged || update.selectionSet || update.viewportChanged) {
        this.decorations = this.getBracketDecorations(update.view);
      }
    }

    getBracketDecorations(view) {
      const { doc } = view.state;
      const decorations = [];
      const regexp = /\[\[([\s\S]*?)\]\]/g;

      let match;
      while ((match = regexp.exec(doc.toString()))) {
        const [fullMatch, group1] = match;
        const startPos = match.index;
        const endPos = startPos + fullMatch.length;

        if (group1 !== undefined && $tw.wiki.tiddlerExists(group1)) {
          decorations.push(
            // Decoration.mark({ class: 'rainbow-bracket' }).range(
            //   startPos,
            //   startPos + 2
            // ),
            Decoration.mark({ class: 'rainbow-bracket-text' }).range(
              startPos + 2,
              endPos - 2
            )
            // Decoration.mark({ class: 'rainbow-bracket' }).range(
            //   endPos - 2,
            //   endPos
            // )
          );
        }
      }

      return Decoration.set(decorations);
    }
  },
  {
    decorations: (v) => v.decorations
  }
);

export default function rainbowBracketsWithText() {
  return [
    rainbowBracketsPlugin,
    EditorView.baseTheme({
      // '.rainbow-bracket': { backgroundColor: 'yellow' },
      '.rainbow-bracket-text': {
        cursor: 'pointer'
        // transition: 'all 0.2s ease'
      },
      '.rainbow-bracket-text:hover': {
        textDecoration: 'underline'
      }
    })
  ];
}
