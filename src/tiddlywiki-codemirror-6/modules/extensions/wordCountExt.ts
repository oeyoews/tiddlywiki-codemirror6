import { showPanel, EditorView, Panel } from '@codemirror/view';
import type { Text } from '@codemirror/state';
import { statusTiddler } from '@/cm6/modules/constants/saveStatus';

function getSaveStatus() {
  const status = $tw.wiki.getTiddlerText(statusTiddler);
  const statusValue = status === 'yes' ? true : false;
  return statusValue ? 'save' : 'unsave';
}

type ISave = ReturnType<typeof getSaveStatus>;

const WORD_CHAR_REGEXP = /[\w\u4e00-\u9fa5]/;
const CHINESE_CHAR_REGEXP = /[\u4e00-\u9fa5]/;

/**
 * Word count rules:
 * - Each Chinese character counts as 1 "word".
 * - Each consecutive run of "word chars" (letters/digits/_ plus Chinese) counts as 1,
 *   but Chinese chars should not merge English word runs.
 */
export function countWordsFromString(text: string) {
  let count = 0;
  let inEnglishWordRun = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const isChineseChar = CHINESE_CHAR_REGEXP.test(ch);
    const isWordChar = WORD_CHAR_REGEXP.test(ch);

    if (isChineseChar || (isWordChar && !inEnglishWordRun)) count++;

    // 中文仍然会增加 count，但不参与“英文/数字/下划线”的连续状态，
    // 以免出现 “你好Hello世界” 少算 “Hello” 的问题。
    inEnglishWordRun = isWordChar && !isChineseChar;
  }

  return count;
}

// @experimental
// TODO: throttle
function countWords(doc: Text) {
  const count = countWordsFromString(doc.toString());
  return `Words: ${count} (Chars: ${doc.length})`;
}

const getPosPercent = (view: EditorView) => {
  const pos = view.state.selection.main.head;
  const doc = view.state.doc;
  const currentLine = doc.lineAt(pos).number;
  const totalLine = doc.lines;
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

        // lineInfo.textContent = getPosPercent(view);
        rightNode.style.cssText = getStyles(getSaveStatus());
      }
    }
  };
}

export function wordCountExt() {
  return showPanel.of(charCountPanel);
}
