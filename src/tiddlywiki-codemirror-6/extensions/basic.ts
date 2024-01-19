import autocomplete from '@/cm6/config/autocomplete';
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput
} from '@codemirror/language';
import { EditorState, Extension } from '@codemirror/state';
import { highlightSelectionMatches } from '@codemirror/search';

import { history } from '@codemirror/commands';

import {
  drawSelection,
  rectangularSelection,
  crosshairCursor
} from '@codemirror/view';

import { indentationMarkers } from '@replit/codemirror-indentation-markers';
import { EditorView, dropCursor, tooltips } from '@codemirror/view';
import tabSizePlugin from '@/cm6/extensions/tab-size';
import removeOutlineExt from './removeOutlineExt';
import fontSizeExt from './fontSizeExt';
import { indentUnit } from '@codemirror/language';
import { Prec } from '@codemirror/state';
import cm6 from '@/cm6/config';
import rainbowBrackets from './rainbowBrackets';

export function cme(self: any): Extension[] {
  return [
    indentationMarkers({
      thickness: 2,
      hideFirstIndent: false,
      markerType: 'codeOnly'
    }),
    dropCursor(),
    tabSizePlugin(),
    removeOutlineExt,
    fontSizeExt(),
    indentUnit.of('	'),
    // EditorState.readOnly.of(true), // NOTE: lastest vim-mode extension has fix that bug

    Prec.high(
      EditorView.domEventHandlers({
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
      parent: self.domNode.ownerDocument?.body // NOTE: preview render bug: Cannot set property parentNode of #<Node> which has only a getter
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
    EditorView.lineWrapping,
    EditorView.contentAttributes.of({
      tabindex: self.widget.editTabIndex ? self.widget.editTabIndex : ''
    }),
    EditorView.contentAttributes.of({
      spellcheck: cm6.spellcheck()
    }),
    EditorView.contentAttributes.of({
      autocorrect: cm6.autocorrect()
    }),
    EditorView.contentAttributes.of({
      translate:
        $tw.wiki.getTiddlerText(
          '$:/state/codemirror-6/translate/' + self.widget.editTitle
        ) === 'yes'
          ? 'yes'
          : 'no'
    }),
    EditorView.perLineTextDirection.of(true),
    EditorView.updateListener.of((v) => {
      if (v.docChanged) {
        const text = self.cm.state.doc.toString();
        self.widget.saveChanges(text);
      }
    })
  ];
}
