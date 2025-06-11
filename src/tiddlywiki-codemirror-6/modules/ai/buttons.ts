import { EditorView } from '@codemirror/view';

// 在文件末尾添加
export function insertAcceptRejectButtons(
  view: EditorView,
  beforeText: string
) {
  // 创建按钮容器
  const btnContainer = document.createElement('div');
  btnContainer.className = 'ai-btn ai-accept-reject-btns';

  // 接受按钮
  const acceptBtn = document.createElement('button');
  acceptBtn.textContent = 'Accept';
  acceptBtn.className = 'ai-btn ai-accept-btn';
  acceptBtn.onclick = () => {
    btnContainer.remove();
  };

  // 拒绝按钮
  const rejectBtn = document.createElement('button');
  rejectBtn.textContent = 'Reject';
  rejectBtn.className = 'ai-btn ai-reject-btn';
  rejectBtn.onclick = () => {
    // 撤销到插入前的内容
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: beforeText }
    });
    btnContainer.remove();
  };

  btnContainer.appendChild(acceptBtn);
  btnContainer.appendChild(rejectBtn);

  // 插入到编辑器父节点
  const parent = view.dom.parentNode as HTMLElement;
  // 避免重复插入
  const old = parent.querySelector('.ai-accept-reject-btns');
  if (old) old.remove();
  parent.appendChild(btnContainer);
}

// 在文件末尾添加
export function insertInterruptButton(
  view: EditorView,
  abortController: AbortController,
  onInterrupt: () => void
) {
  const btn = document.createElement('button');
  btn.textContent = 'Stop';
  btn.className = 'ai-btn ai-interrupt-btn';
  btn.onclick = () => {
    abortController.abort();
    btn.remove();
    onInterrupt();
  };
  const parent = view.dom.parentNode as HTMLElement;
  removeInterruptButton(view);
  parent.appendChild(btn);
}

export function removeInterruptButton(view: EditorView) {
  const parent = view.dom.parentNode as HTMLElement;
  const old = parent.querySelector('.ai-interrupt-btn');
  if (old) old.remove();
}
