import { showPanel, EditorView, Panel } from '@codemirror/view';
import type { Text } from '@codemirror/state';

// function countWords(doc: Text) {
//   let count = 0,
//     iter = doc.iter();
//   while (!iter.next().done) {
//     let inWord = false;
//     for (let i = 0; i < iter.value.length; i++) {
//       let word = /[\w\u4e00-\u9fa5]/.test(iter.value[i]);
//       // if (word && !inWord)
//       count++;
//       inWord = word;
//     }
//   }
//   return `word count: ${count} (${doc.length} chars)`;
// }
function countWords(doc: Text) {
  let count = 0,
    iter = doc.iter();

  while (!iter.next().done) {
    let inWord = false;

    for (let i = 0; i < iter.value.length; i++) {
      // 修改正则表达式以包括字母、数字和 CJK 字符
      let word = /[\w\u4e00-\u9fa5]/.test(iter.value[i]);
      let isChineseChar = /[\u4e00-\u9fa5]/.test(iter.value[i]);

      if (isChineseChar || (word && !inWord)) count++;
      inWord = word;
    }
  }

  return `单词数量：${count} (字符数：${doc.length})`;
}

function charCountPanel(view: EditorView): Panel {
  let dom = document.createElement('div');
  dom.style.cssText = 'color: grey; font-size:0.8rem;';
  dom.textContent = countWords(view.state.doc);

  return {
    dom,
    update(update) {
      if (update.docChanged) dom.textContent = countWords(update.state.doc);
    }
  };
}

export function charsExtension() {
  return showPanel.of(charCountPanel);
}
