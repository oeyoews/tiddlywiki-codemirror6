// @ts-nocheck

/** 给[[xxx]] 添加下划线 */
// https://codemirror.net/examples/decoration/
import { EditorView, Decoration, DecorationSet } from '@codemirror/view';
import { StateField, StateEffect } from '@codemirror/state';

// 修改 addUnderline 状态效果，使其匹配 [[xx]]
const addUnderline = StateEffect.define<{ from: number; to: number }>({
  map: ({ from, to }, change) => {
    // 获取整个文档内容
    const text = change.state.sliceDoc(0, change.state.doc.length);

    // 查找并扩展选择范围以匹配 [[xx]]
    const regex = /\[\[([^\]]*)\]\]/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      from = match.index;
      to = from + match[0].length;
    }

    return { from: change.mapPos(from), to: change.mapPos(to) };
  }
});

const underlineMark = Decoration.mark({ class: 'cm-underline' });

// 定义一个状态字段，用于管理下划线的装饰集合
const underlineField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(underlines, tr) {
    underlines = underlines.map(tr.changes);
    for (let e of tr.effects)
      if (e.is(addUnderline)) {
        underlines = underlines.update({
          add: [underlineMark.range(e.value.from, e.value.to)]
        });
      }
    return underlines;
  },
  provide: (f) => EditorView.decorations.from(f)
});

// 定义一个主题，用于定义下划线的样式
const underlineTheme = EditorView.baseTheme({
  '.cm-underline': {
    background: 'mediumpurple',
    padding: '0 2px',
    borderRadius: '4px',
    color: 'black'
  }
});
// 修改 underlineSelection 函数以自动匹配 [[xx]]
export function underlineSelectionExt(view: EditorView) {
  // 创建状态效果数组，用于添加下划线
  const effects: StateEffect<unknown>[] = [];
  let match;

  // 获取整个文档内容
  const text = view.state.doc.toString();

  // 使用正则表达式匹配 [[xx]] 并添加下划线效果
  const regex = /\[\[([^\]]*)\]\]/g;
  while ((match = regex.exec(text)) !== null) {
    effects.push(
      addUnderline.of({ from: match.index, to: match.index + match[0].length })
    );
  }

  // 如果没有匹配到 [[xx]]，返回 false
  if (!effects.length) return false;

  // 如果字段不存在，添加字段和主题
  if (!view.state.field(underlineField, false))
    effects.push(StateEffect.appendConfig.of([underlineField, underlineTheme]));

  // 触发状态效果，添加下划线
  view.dispatch({ effects });
  return true;
}
