import { showPanel, EditorView, Panel } from '@codemirror/view';
import type { Text } from '@codemirror/state';
import { statusTiddler } from '@/cm6/modules/constants/saveStatus';

function getSaveStatus() {
  const status = $tw.wiki.getTiddlerText(statusTiddler);
  const statusValue = status === 'yes' ? true : false;
  return statusValue ? 'Saved' : 'Unsaved';
}

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

  // TODO: check user language
  return `Words: ${count} (Chars: ${doc.length})`;
}

function tiddlerSaved() {
  const Save = getSaveStatus();
  return Save;
}

function charCountPanel(view: EditorView): Panel {
  const dom = document.createElement('div');

  const leftNode = document.createElement('div');
  const rightNode = document.createElement('div');

  dom.style.cssText =
    'color: grey; font-size:0.8rem;display: flex; justify-content: space-between;';

  leftNode.textContent = countWords(view.state.doc);

  rightNode.style.cssText =
    tiddlerSaved() === 'Saved' ? getStyles('save') : getStyles('unsave');
  dom.append(leftNode, rightNode);

  function getStyles(status: 'save' | 'unsave') {
    let color;
    if (status === 'save') {
      color = 'rgb(34, 197, 94)';
    } else {
      color = '#f87171';
    }

    const styles = `background-color: ${color};border-radius: 9999px; width: 0.75rem; height: 0.75rem; margin-block-start: 0.5em;margin-block-end: 0.5em `;
    return styles;
  }

  return {
    dom,
    update(update) {
      if (update.docChanged) {
        leftNode.textContent = countWords(view.state.doc);

        leftNode.textContent = countWords(view.state.doc);
        rightNode.style.cssText =
          tiddlerSaved() === 'Saved' ? getStyles('save') : getStyles('unsave');
      }
    }
  };
}

export function wordCountExt() {
  return showPanel.of(charCountPanel);
}
