// @ts-nocheck
import { ViewPlugin } from '@codemirror/view';

// TODO: https://codemirror.net/examples/panel/
// 检测文档大小
export default ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.dom = view.dom.appendChild(document.createElement('div'));
      this.dom.style.cssText =
        'position: absolute; bottom: -20px; right: 0px; color: grey; font-size:0.8rem;';
      this.dom.textContent = view.state.doc.length + ' chars';
    }

    update(update) {
      if (update.docChanged)
        this.dom.textContent = update.state.doc.length + ' chars';
    }

    destroy() {
      this.dom.remove();
    }
  }
);
