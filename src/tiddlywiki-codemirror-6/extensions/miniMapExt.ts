import { EditorView } from '@codemirror/view';
import cm6 from '../cm6';
import { showMinimap } from '@replit/codemirror-minimap';
import type { Extension } from '@codemirror/state';

export function miniMapExt(cme: Extension[]) {
  const miniMapNode = (v: EditorView) => {
    const dom = document.createElement('div');
    dom.style.cssText = 'background-color: transparent !important;';
    return { dom };
  };

  if (cm6.minimap()) {
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
