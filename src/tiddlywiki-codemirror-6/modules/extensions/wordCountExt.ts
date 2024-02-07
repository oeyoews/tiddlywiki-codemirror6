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
  const Save = getSaveStatus();

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
  return `Words：${count} (Chars：${doc.length}) | ${Save}`;
}

function charCountPanel(view: EditorView): Panel {
  const dom = document.createElement('div');
  dom.style.cssText =
    'color: grey; font-size:0.8rem;display: flex; justify-content: end;';
  dom.textContent = countWords(view.state.doc);

  return {
    dom,
    update(update) {
      if (update.docChanged) dom.textContent = countWords(update.state.doc);
    }
  };
}

export function wordCountExt() {
  return showPanel.of(charCountPanel);
}
