import { EditorView } from '@codemirror/view';

// 在文件末尾添加
export function insertAcceptRejectButtons(
  view: EditorView,
  beforeText: string
) {
  // 创建按钮容器
  const btnContainer = document.createElement('div');
  btnContainer.className = 'ai-accept-reject-btns';
  btnContainer.style.position = 'absolute';
  btnContainer.style.right = '24px';
  btnContainer.style.bottom = '24px';
  btnContainer.style.zIndex = '1000';
  btnContainer.style.background = 'rgba(255,255,255,0.98)';
  btnContainer.style.border = '1px solid #e0e0e0';
  btnContainer.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
  btnContainer.style.padding = '14px 18px';
  btnContainer.style.borderRadius = '8px';
  btnContainer.style.display = 'flex';
  btnContainer.style.gap = '18px';
  btnContainer.style.alignItems = 'center';

  // 按钮基础样式
  const baseBtnStyle = `
    font-size: 15px;
    font-weight: 500;
    border: none;
    outline: none;
    border-radius: 8px;
    padding: 5px 14px;
    cursor: pointer;
    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  `;

  // 接受按钮
  const acceptBtn = document.createElement('button');
  acceptBtn.textContent = '接受';
  acceptBtn.style.cssText =
    baseBtnStyle +
    `
    background: linear-gradient(90deg, #4f8cff 0%, #38d9a9 100%);
    color: #fff;
    box-shadow: 0 2px 8px rgba(79,140,255,0.12);
  `;
  acceptBtn.onmouseenter = () => {
    acceptBtn.style.background =
      'linear-gradient(90deg, #357ae8 0%, #20c997 100%)';
  };
  acceptBtn.onmouseleave = () => {
    acceptBtn.style.background =
      'linear-gradient(90deg, #4f8cff 0%, #38d9a9 100%)';
  };
  acceptBtn.onclick = () => {
    btnContainer.remove();
  };

  // 拒绝按钮
  const rejectBtn = document.createElement('button');
  rejectBtn.textContent = '拒绝';
  rejectBtn.style.cssText =
    baseBtnStyle +
    `
    background: #fff;
    color: #ff4d4f;
    border: 1.5px solid #ff4d4f;
  `;
  rejectBtn.onmouseenter = () => {
    rejectBtn.style.background = '#ff4d4f';
    rejectBtn.style.color = '#fff';
  };
  rejectBtn.onmouseleave = () => {
    rejectBtn.style.background = '#fff';
    rejectBtn.style.color = '#ff4d4f';
  };
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
  btn.textContent = '中断生成';
  btn.className = 'ai-interrupt-btn';
  btn.style.position = 'absolute';
  btn.style.right = '24px';
  btn.style.bottom = '70px';
  btn.style.zIndex = '1001';
  btn.style.background = '#fffbe6';
  btn.style.color = '#faad14';
  btn.style.border = '1.5px solid #faad14';
  btn.style.borderRadius = '8px';
  btn.style.padding = '5px 14px';
  btn.style.fontSize = '15px';
  btn.style.fontWeight = '500';
  btn.style.cursor = 'pointer';
  btn.style.boxShadow = '0 2px 8px rgba(250,173,20,0.08)';
  btn.onmouseenter = () => {
    btn.style.background = '#ffe58f';
  };
  btn.onmouseleave = () => {
    btn.style.background = '#fffbe6';
  };
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
