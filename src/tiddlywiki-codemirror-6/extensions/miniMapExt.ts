import { EditorView } from '@codemirror/view';
import cmeConfig from '../cmeConfig';
import { showMinimap } from '@replit/codemirror-minimap';

export function miniMapExt(cme: []) {
  const miniMapNode = (v: EditorView) => {
    const dom = document.createElement('div');
    dom.style.cssText = 'background-color: transparent !important;';
    return { dom };
  };

  if (cmeConfig.minimap()) {
    cme.push(
      // @ts-ignore
      showMinimap.compute(['doc'], (state) => {
        return {
          create: miniMapNode,
          showOverlay: 'mouse-over'
        };
      })
    );
  }
}
