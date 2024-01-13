import { CompletionInfo } from '@codemirror/autocomplete';
import conf from '../cm6';
export function renderTid(title: string | undefined): CompletionInfo | null {
  if (!title) return null;
  if ($tw.wiki.getTiddler(title)?.fields.render === 'false') return null;
  if (!conf.tiddlerPreview()) return null;

  if (!$tw.wiki.getTiddlerText(title)) {
    const titleNode = document.createElement('h2');
    titleNode.innerHTML = title;
    return titleNode;
  }
  // NOTE: 如果需要解析为 inline 的话，会导致 !! 这种 wikitext 的语法 parse 错误
  let previewHTML = '暂不支持预览';
  // 这里没有传入 this, 不能判断 fakedom
  const preview = document.createElement('div');
  try {
    previewHTML = $tw.wiki.renderText(
      'text/html',
      'text/vnd.tiddlywiki', // 是 textType, 不是渲染 type. 使用 transclude 自然选择 text/vnd.tiddlywiki,
      // !! ${title} \n
      `<$transclude $tiddler='${title}' $mode='block' />`
    );
    if (!previewHTML || previewHTML === '<p></p>') return null;
    preview.innerHTML = previewHTML;
    preview.className = 'cm-image-preview';
  } catch (e) {
    // console.log(e);
  }
  return preview;
}
