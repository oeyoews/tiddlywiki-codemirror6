import {
  EditorView,
  Decoration,
  DecorationSet,
  ViewPlugin,
  WidgetType,
  ViewUpdate
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';

// 创建一个 WidgetType 类，生成星号替换文本
class MaskWidget extends WidgetType {
  constructor(readonly content: string) {
    super();
  }

  toDOM(): HTMLElement {
    const span = document.createElement('span');
    span.textContent = '|' + '*'.repeat(this.content.length) + '|'; // 掩码为与内容长度相同的星号
    return span;
  }

  // 配置的标志，允许光标进入掩码区域
  //   ignoreEvent(): boolean {
  //     return false; // 保证点击事件不会被掩码阻止，允许选择
  //   }
}

// 定义一个插件来处理密码掩码
class MaskPlugin {
  decorations: DecorationSet;
  view: EditorView;

  constructor(view: EditorView) {
    this.view = view;
    this.decorations = this.buildDecorations(view); // 初始生成掩码装饰
  }

  // 构建掩码装饰，视光标位置决定是否掩码
  buildDecorations(view: EditorView): DecorationSet {
    let widgets: any[] = [];
    const content = view.state.doc.toString(); // 获取当前编辑器的文本内容
    const cursorPos = view.state.selection.main.head; // 获取光标位置

    // 匹配 |xxx| 格式的部分
    const regex = /\|([^\|]+)\|/g;
    let match;

    // 遍历文本中的每个匹配部分
    while ((match = regex.exec(content)) !== null) {
      const maskedRangeStart = match.index;
      const maskedRangeEnd = regex.lastIndex;

      // 如果光标不在该范围内，进行掩码
      const isCursorInMaskedRange =
        cursorPos >= maskedRangeStart && cursorPos < maskedRangeEnd;

      if (!isCursorInMaskedRange) {
        widgets.push(
          Decoration.replace({
            widget: new MaskWidget(match[1]), // 使用我们定义的 MaskWidget
            inclusive: true // 允许光标进入掩码区域
          }).range(maskedRangeStart, maskedRangeEnd)
        );
      }
    }

    return Decoration.set(widgets, true); // 返回装饰集合
  }

  // 当视图更新时，重新生成掩码
  update(update: ViewUpdate) {
    // 如果光标位置、文档内容或可见范围发生变化，重新计算掩码
    if (update.docChanged || update.selectionSet || update.viewportChanged) {
      this.decorations = this.buildDecorations(update.view);
    }
  }
}

// 定义一个 ViewPlugin 工厂函数来生成 MaskPlugin 实例
const maskPlugin = ViewPlugin.fromClass(MaskPlugin, {
  decorations: (v) => v.decorations
});

// 使用这个扩展
export function passwordMask() {
  return [maskPlugin];
}
