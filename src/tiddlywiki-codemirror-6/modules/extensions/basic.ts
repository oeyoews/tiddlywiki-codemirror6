import {
  statusTiddler,
  updateSaveStatus
} from '@/cm6/modules/constants/saveStatus';
import autocomplete from '@/cm6/config/autocomplete';
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput
} from '@codemirror/language';
import { EditorState, Extension } from '@codemirror/state';
import { search, highlightSelectionMatches } from '@codemirror/search';

import { history } from '@codemirror/commands';

import {
  drawSelection,
  rectangularSelection,
  crosshairCursor,
  type ViewUpdate
} from '@codemirror/view';

import { indentationMarkers } from '@replit/codemirror-indentation-markers';
import { EditorView, dropCursor, tooltips } from '@codemirror/view';
import tabSizePlugin from '@/cm6/modules/extensions/tab-size';
import fontSizeExt from './fontSizeExt';
import iconpatch from './iconpatch';
import { indentUnit } from '@codemirror/language';
import { Prec } from '@codemirror/state';
import cm6 from '@/cm6/config';
import rainbowBrackets from './rainbowBrackets';

export function cme(self: any): Extension[] {
  let extensions = [
    indentationMarkers({
      thickness: 2,
      hideFirstIndent: false,
      markerType: 'codeOnly'
    }),
    dropCursor(),
    tabSizePlugin(),
    fontSizeExt(),
    iconpatch,
    indentUnit.of('	'),
    search({ top: cm6.searchPosition() === 'top' }),
    // EditorState.readOnly.of(true), // NOTE: lastest vim-mode extension has fix that bug

    Prec.high(
      EditorView.domEventHandlers({
        // TODO: markdown filetype drag view
        drop(event, view) {
          self.dragCancel = false;
          return self.handleDropEvent(event, view);
        },
        dragstart(event, view) {
          self.dragCancel = true;
          return false;
        },
        dragenter(event: DragEvent, view) {
          self.dragCancel = true;
          if (
            self.widget.isFileDropEnabled &&
            ($tw.utils.dragEventContainsFiles(event) ||
              event.dataTransfer?.files.length)
          ) {
            event.preventDefault();
            return true;
          }
          return false;
        },
        dragover(event: DragEvent, view) {
          self.dragCancel = true;
          if (
            self.widget.isFileDropEnabled &&
            ($tw.utils.dragEventContainsFiles(event) ||
              event.dataTransfer?.files.length)
          ) {
            event.preventDefault();
            return true;
          }
          return false;
        },
        dragleave(event, view) {
          self.dragCancel = false;
          if (self.widget.isFileDropEnabled) {
            event.preventDefault();
            return true;
          }
          return false;
        },
        dragend(event, view) {
          self.dragCancel = true;
          if (self.widget.isFileDropEnabled) {
            //event.preventDefault();
            //return true;
          }
          return false;
        },
        paste(event: any) {
          if (self.widget.isFileDropEnabled) {
            event.twEditor = true;
            return self.widget.handlePasteEvent.call(self.widget, event);
          } else {
            event.twEditor = true;
          }
          return false;
        },
        keydown(event, view) {
          return self.handleKeydownEvent(event, view);
        },
        focus(event, view) {
          if (self.widget.editCancelPopups) {
            // @ts-ignore
            $tw.popup.cancel(0);
          }
          return false;
        },
        blur() {
          return false;
        }
      })
    ),

    tooltips({
      parent: self.domNode
      // parent: self.domNode.ownerDocument?.body // NOTE: preview render bug: Cannot set property parentNode of #<Node> which has only a getter
    }),
    // TODO
    // highlightSpecialChars({
    // render: () => {
    //   const spanElement = document.createElement('span');
    //   spanElement.style.cursor = 'pointer';
    //   spanElement.addEventListener('click', (e: MouseEvent) => {
    //     if (e.ctrlKey) {
    //     }
    //   });
    //   spanElement.textContent = 'hhh';
    //   return spanElement;
    // },
    // addSpecialChars: /hhh/
    // }),
    history(),
    drawSelection({
      cursorBlinkRate: cm6.cursorBlinkRate()
    }),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    autocomplete(),
    rectangularSelection(),
    crosshairCursor(),
    highlightSelectionMatches(),
    rainbowBrackets(),
    EditorView.contentAttributes.of({
      tabindex: self.widget.editTabIndex ? self.widget.editTabIndex : ''
    }),
    // EditorView.contentAttributes.of({
    //   spellcheck: cm6.spellcheck()
    // }),
    // EditorView.contentAttributes.of({
    //   autocorrect: cm6.autocorrect()
    // }),
    // EditorView.contentAttributes.of({
    //   translate:
    //     $tw.wiki.getTiddlerText(
    //       '$:/state/codemirror-6/translate/' + self.widget.editTitle
    //     ) === 'yes'
    //       ? 'yes'
    //       : 'no'
    // }),
    EditorView.perLineTextDirection.of(true),
    EditorView.updateListener.of((v: ViewUpdate) => {
      const editor: EditorView = self.editor; // 这是动态计算出来的 cm, 这也就是为什么在初始化前就可以拿到了 this.cm。如果直接在箭头函数的外面写死 cm, 那么 this.cm 就拿不到了
      if (editor?.composing) {
        // return;
      }
      // NOTE: cm6 似乎自带 debounce, 这里使用 debounce 无效
      // HACK: tiddlywiki 对于 markdown 的空双花括号会有递归 bug, 预览会导致页面卡死
      const pos = v.state.selection.main.head;
      // 处理tw 中的空双花括号递归解析
      if (
        pos >= 2 &&
        v.state.doc.length - pos >= 2 &&
        v.state.sliceDoc(pos - 2, pos) === '{{' &&
        v.state.sliceDoc(pos, pos + 2) === '}}'
      ) {
        return;
      }

      if (v.docChanged) {
        updateSaveStatus(false);
        const text = editor.state.doc.toString();
        self.widget.saveChanges(text); // update text with tiddlywiki api
      }
    })
  ];
  // 换行
  if (cm6.lineWrapping()) {
    extensions.push(EditorView.lineWrapping);
  }
  return extensions;
}
