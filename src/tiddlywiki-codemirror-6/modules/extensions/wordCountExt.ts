import { showPanel, EditorView, Panel } from '@codemirror/view';
import type { Text } from '@codemirror/state';
import { statusTiddler } from '@/cm6/modules/constants/saveStatus';

function getSaveStatus() {
  const status = $tw.wiki.getTiddlerText(statusTiddler);
  const statusValue = status === 'yes' ? true : false;
  return statusValue ? 'save' : 'unsave';
}

type ISave = ReturnType<typeof getSaveStatus>;

function countWords(doc: Text) {
  let count = 0,
    iter = doc.iter();

  while (!iter.next().done) {
    let inWord = false;

    for (let i = 0; i < iter.value.length; i++) {
      let word = /[\w\u4e00-\u9fa5]/.test(iter.value[i]);
      let isChineseChar = /[\u4e00-\u9fa5]/.test(iter.value[i]);

      if (isChineseChar || (word && !inWord)) count++;
      inWord = word;
    }
  }

  return `Words: ${count} (Chars: ${doc.length})`;
}

const getPosPercent = (view: EditorView) => {
  const pos = view.state.selection.main.head;
  const doc = view.state.doc;
  const totalLength = doc.length;
  const currentLine = doc.lineAt(pos).number;
  const totalLine = doc.lineAt(totalLength).number;
  const percent = Math.round((currentLine / totalLine) * 100) + ' %';
  return percent;
};

function charCountPanel(view: EditorView): Panel {
  const dom = document.createElement('div');

  const leftNode = document.createElement('div');
  // const lineInfo = document.createElement('div');
  const rightNode = document.createElement('div');

  dom.style.cssText =
    'color: grey; font-size:0.8rem;display: flex; justify-content: space-between;';

  // lineInfo.textContent = getPosPercent(view);
  leftNode.textContent = countWords(view.state.doc);

  rightNode.style.cssText = getStyles(getSaveStatus());

  dom.append(leftNode, rightNode);

  function getStyles(status: ISave) {
    let color;
    if (status === 'save') {
      color = 'rgb(34, 197, 94)';
    } else {
      color = '#f87171';
    }

    const styles = `background-color: ${color};border-radius: 9999px; width: 0.65rem; height: 0.65rem; 0.5em; margin: 0.5em;`;
    return styles;
  }

  return {
    dom,
    update(update) {
      if (update.docChanged) {
        leftNode.textContent = countWords(view.state.doc);
        leftNode.textContent = countWords(view.state.doc);

        lineInfo.textContent = getPosPercent(view);
        rightNode.style.cssText = getStyles(getSaveStatus());
      }
    }
  };
}

export function wordCountExt() {
  return showPanel.of(charCountPanel);
}
