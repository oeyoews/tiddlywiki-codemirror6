//@ts-nocheck

/** 彩虹括号 */
// https://github.com/eriknewland/rainbowbrackets/blob/main/rainbowBrackets.js
import { EditorView, Decoration, ViewPlugin } from '@codemirror/view';

function generateColors() {
  return [
    'red',
    'orange',
    // 'yellow',
    'green',
    'blue',
    'indigo',
    'violet'
  ];
}

const rainbowBracketsPlugin = ViewPlugin.fromClass(
  class {
    decorations;

    constructor(view: EditorView) {
      this.decorations = this.getBracketDecorations(view);
    }

    update(update) {
      if (update.docChanged || update.selectionSet || update.viewportChanged) {
        this.decorations = this.getBracketDecorations(update.view);
      }
    }

    getBracketDecorations(view: EditorView) {
      const { doc } = view.state;
      const decorations = [];
      const stack = [];
      const colors = generateColors();

      for (let pos = 0; pos < doc.length; pos += 1) {
        const char = doc.sliceString(pos, pos + 1);
        if (char === '(' || char === '[' || char === '{') {
          stack.push({ type: char, from: pos });
        } else if (char === ')' || char === ']' || char === '}') {
          const open = stack.pop();
          if (open && open.type === this.getMatchingBracket(char)) {
            const color = colors[stack.length % colors.length];
            decorations.push(
              Decoration.mark({ class: `rainbow-bracket-${color}` }).range(
                open.from,
                open.from + 1
              ),
              Decoration.mark({ class: `rainbow-bracket-${color}` }).range(
                pos,
                pos + 1
              )
            );
          }
        }
      }

      decorations.sort((a, b) => a.from - b.from || a.startSide - b.startSide);

      return Decoration.set(decorations);
    }

    // eslint-disable-next-line class-methods-use-this
    getMatchingBracket(closingBracket) {
      switch (closingBracket) {
        case ')':
          return '(';
        case ']':
          return '[';
        case '}':
          return '{';
        default:
          return null;
      }
    }
  },
  {
    decorations: (v) => v.decorations
  }
);

export default function rainbowBrackets() {
  return [
    rainbowBracketsPlugin,
    EditorView.baseTheme({
      '.rainbow-bracket-red': { color: 'red' },
      '.rainbow-bracket-red > span': { color: 'red' },
      '.rainbow-bracket-orange': { color: 'orange' },
      '.rainbow-bracket-orange > span': { color: 'orange' },
      // '.rainbow-bracket-yellow': { color: 'yellow' },
      '.rainbow-bracket-yellow > span': { color: 'yellow' },
      '.rainbow-bracket-green': { color: 'green' },
      '.rainbow-bracket-green > span': { color: 'green' },
      '.rainbow-bracket-blue': { color: 'blue' },
      '.rainbow-bracket-blue > span': { color: 'blue' },
      '.rainbow-bracket-indigo': { color: 'indigo' },
      '.rainbow-bracket-indigo > span': { color: 'indigo' },
      '.rainbow-bracket-violet': { color: 'violet' },
      '.rainbow-bracket-violet > span': { color: 'violet' }
    })
  ];
}
