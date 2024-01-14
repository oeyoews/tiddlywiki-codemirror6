import { CompletionInfo } from '@codemirror/autocomplete';
import conf from '../cm6';
export function renderTid(title: string | undefined): CompletionInfo | null {
  if (!conf.tiddlerPreview()) {
    console.log('tiddlerPreview is false');
    return null;
  }

  if (!title) {
    console.info('title not exist');
    return null;
  }
  if ($tw.wiki.getTiddler(title)?.fields.render === 'false') {
    console.warn(title, ' disabling render');
    return null;
  }

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
      `<$transclude $tiddler='${title}' $mode='block' />\n<footer style="text-align: right;margin-right: 10px">Snippet Tiddler Is: ${title}</footer>`
    );
    // || previewHTML === '<p></p>'
    if (!previewHTML) return null;
    preview.innerHTML = previewHTML;
    preview.className = 'cm-image-preview';
  } catch (e) {
    // console.log(e);
  }
  return preview;
}
