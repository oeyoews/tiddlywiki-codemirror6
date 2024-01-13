import { CompletionInfo } from '@codemirror/autocomplete';
import conf from '../cmeConfig';
export function renderTid(title: string | undefined): CompletionInfo | null {
  if (!title) return null;
  if ($tw.wiki.getTiddler(title)?.fields.render === 'false') return null;
  if (!conf.tiddlerPreview()) return null;
  // NOTE: 无法检测到系统 tiddler
  // if (!$tw.wiki.tiddlerExists(title)) return null;

  if (!$tw.wiki.getTiddlerText(title)) {
    const titleNode = document.createElement('h2');
    titleNode.innerHTML = title;
    return titleNode;
  }
  // NOTE: 如果需要解析为 inline 的话，会导致 !! 这种 wikitext 的语法 parse 错误
  let previewHTML = '暂不支持预览';
  const preview = document.createElement('div');
  try {
    previewHTML = $tw.wiki.renderTiddler('text/html', title, {
      // parseAsInline: false
    });
    if (!previewHTML) return null;
    preview.innerHTML = previewHTML;
    preview.className = 'cm-image-preview';
  } catch (e) {}
  return preview;
}
