// import { inlineSuggestion } from 'codemirror-extension-inline-suggestion';

import {
  indentUnit,
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput
} from '@codemirror/language';
import {
  EditorState,
  EditorSelection,
  Prec,
  Extension
} from '@codemirror/state';
import {
  highlightSelectionMatches,
  openSearchPanel,
  closeSearchPanel
} from '@codemirror/search';

import { completionStatus } from '@codemirror/autocomplete';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';
import { history, undo, redo } from '@codemirror/commands';

import {
  EditorView,
  dropCursor,
  highlightSpecialChars,
  drawSelection,
  rectangularSelection,
  crosshairCursor,
  tooltips,
  hoverTooltip
} from '@codemirror/view';

import tabSizePlugin from './utils/tab-size';
import cmeConfig from './cmeConfig';
import autocompletionConfig from './modules/autocompletion-config';
import dynamicmode from './modules/mode';
import removeOutlineExt from './extensions/removeOutlineExt';
import { miniMapExt } from './extensions/miniMapExt';
import rainbowBrackets from './extensions/rainbowBrackets';
import fontSizeExt from './extensions/fontSizeExt';
import { cmkeymaps } from './modules/keymap';
import configExtensions from './modules/config/index';
import { IOperation, IOperationType, operationTypes } from './operationTypes';
import type { TW_Element } from 'tiddlywiki';
import type { IWidget, IOptions } from './types';

class CodeMirrorEngine {
  widget: IWidget;
  cme: Extension[];
  domNode: TW_Element;
  parentNode: Node;
  nextSibling: Node;
  private cm: EditorView = new EditorView();
  private state: EditorState;
  private dragCancel: boolean = false;
  private errorNode: TW_Element;

  constructor(options = {} as IOptions) {
    const self = this;

    this.widget = options.widget;
    this.parentNode = options.parentNode;
    this.nextSibling = options.nextSibling;

    // Must use this.widget.document.createElement('div'), try catch works ???
    this.domNode = this.widget.document.createElement('div'); // Create the wrapper DIV

    // modunt to tiddlywiki editor widget
    this.parentNode.insertBefore(this.domNode, this.nextSibling); // mount
    this.widget.domNodes.push(this.domNode);

    this.domNode.className = this.widget.editClass || ''; // style
    this.domNode.style.display = 'inline-block';

    this.cme = [
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
      // EditorState.readOnly.of(true),

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
          paste(event) {
            if (self.widget.isFileDropEnabled) {
              // @ts-ignore
              event['twEditor'] = true;
              return self.widget.handlePasteEvent.call(self.widget, event);
            } else {
              // @ts-ignore
              event['twEditor'] = true;
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
        parent: this.domNode.ownerDocument?.body // preview render bug: Cannot set property parentNode of #<Node> which has only a getter
      }),
      // hoverTooltip(), // previe tiddler
      highlightSpecialChars(), // TODO: 可以高亮 link
      history(),
      drawSelection({
        cursorBlinkRate: cmeConfig.cursorBlinkRate()
      }),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      autocompletionConfig(),
      rectangularSelection(),
      crosshairCursor(),
      highlightSelectionMatches(),
      rainbowBrackets(),
      cmkeymaps,
      EditorView.lineWrapping, // enable line wrap
      EditorView.contentAttributes.of({
        tabindex: this.widget.editTabIndex ? this.widget.editTabIndex : ''
      }),
      EditorView.contentAttributes.of({
        spellcheck: cmeConfig.spellcheck()
      }),
      EditorView.contentAttributes.of({
        autocorrect: cmeConfig.autocorrect()
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
      EditorView.updateListener.of(function (v) {
        if (v.docChanged) {
          const text = self.cm.state.doc.toString();
          self.widget.saveChanges(text);
        }
      })
    ];

    configExtensions(this.cme, this.widget);
    miniMapExt(this.cme); // add minimap
    dynamicmode(options.type, this.cme); // update extensions

    this.errorNode = this.widget.document.createElement('div');
    this.errorNode.textContent =
      'Virtual DOM detected, Skip rendering this widget !!!';
    this.errorNode.style.fontSize = '0.8rem';
    this.errorNode.style.color = 'red';
    this.errorNode.style.fontWeight = 'bold';

    this.state = EditorState.create({
      doc: options.value,
      extensions: this.cme
    });

    try {
      this.cm = new EditorView({
        parent: this.domNode, // editor mount
        state: this.state
      });
    } catch (e) {
      this.parentNode.removeChild(this.domNode);
      // console.error(e);
      if (this.widget.document.isTiddlyWikiFakeDom) {
        this.parentNode.appendChild(this.errorNode);
      }
    }
  }

  handleDropEvent(event: DragEvent, view: EditorView) {
    if (!this.widget.isFileDropEnabled) {
      event.stopPropagation();
      return false;
    }
    if (
      $tw.utils.dragEventContainsFiles(event) ||
      event.dataTransfer?.files.length
    ) {
      const dropCursorPos = view.posAtCoords(
        { x: event.clientX, y: event.clientY },
        false
      );
      view.dispatch({
        selection: { anchor: dropCursorPos, head: dropCursorPos }
      });
      event.preventDefault();
      return true;
    }
    return false;
  }

  handleDragEnterEvent(event: DragEvent) {
    return false;
  }

  handleKeydownEvent(e: KeyboardEvent, view: EditorView) {
    if ($tw.keyboardManager.handleKeydownEvent(e, { onlyPriority: true })) {
      this.dragCancel = false;
      return true;
    }
    if (
      e.key === 'Escape' &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey &&
      !e.metaKey &&
      completionStatus(this.cm.state) === 'active'
    ) {
      e.stopPropagation();
      return false;
    }

    let widget = this.widget;
    const keyboardWidgets = [];
    while (widget) {
      if (widget.parseTreeNode.type === 'keyboard') {
        keyboardWidgets.push(widget);
      }
      widget = widget.parentWidget as IWidget;
    }
    if (keyboardWidgets.length > 0) {
      let handled = undefined;
      for (let i = 0; i < keyboardWidgets.length; i++) {
        const keyboardWidget = keyboardWidgets[i];
        const keyInfoArray = keyboardWidget.keyInfoArray;
        if ($tw.keyboardManager.checkKeyDescriptors(e, keyInfoArray)) {
          if (
            this.dragCancel &&
            $tw.keyboardManager
              .getPrintableShortcuts(keyInfoArray)
              .indexOf('Escape') !== -1
          ) {
            handled = false;
          } else {
            handled = true;
          }
        }
      }
      if (handled) {
        this.dragCancel = false;
        return true;
      } else if (handled === false) {
        e.stopPropagation();
        this.dragCancel = false;
        return true;
      }
    }
    this.dragCancel = false;
    return this.widget.handleKeydownEvent.call(this.widget, e);
  }

  /*
  Set the text of the engine if it doesn't currently have focus
  */
  setText(text: string) {
    if (!this.cm.hasFocus) {
      this.updateDomNodeText(text);
    }
  }

  /* Update the DomNode with the new text */
  updateDomNodeText(text: string) {
    const selections = this.cm.state.selection;
    this.cm.dispatch(
      this.cm.state.update({
        changes: {
          from: 0,
          to: this.cm.state.doc.length,
          insert: text
        },
        selection: selections,
        // @ts-ignore
        docChanged: true
      })
    );
  }

  /* Get the text of the engine */
  getText() {
    return this.cm.state.doc.toString();
  }

  /** @description Fix the height of textarea to fit content, 其他的文本操作模块需要用到原型上的方法，比如 editortoolbar */
  fixHeight() {
    this.cm.requestMeasure();
  }

  /* Focus the engine node */
  focus() {
    this.cm.focus();
  }

  /* Create a blank structure representing a text operation */
  createTextOperation(type: IOperationType) {
    const selections = this.cm.state.selection.ranges;
    let operations;
    if (operationTypes.includes(type)) {
      operations = [];
      for (let i = 0; i < selections.length; i++) {
        const anchorPos = selections[i].from,
          headPos = selections[i].to;
        const operation = {
          text: this.cm.state.doc.toString(),
          selStart: anchorPos,
          selEnd: headPos,
          cutStart: null,
          cutEnd: null,
          replacement: null,
          newSelStart: null,
          newSelEnd: null
        };
        // @ts-ignore
        operation.selection = this.cm.state.sliceDoc(anchorPos, headPos);
        operations.push(operation);
      }
    } else {
      operations = {
        text: this.cm.state.doc.toString(),
        selStart: selections[0].from,
        selEnd: selections[0].to,
        cutStart: null,
        cutEnd: null,
        replacement: null,
        newSelStart: null,
        newSelEnd: null
      };
    }
    return operations;
  }

  /* Execute a text operation */
  executeTextOperation(operations: IOperation) {
    if (operations.type && operations.type === 'undo') {
      undo(this.cm);
    } else if (operations.type && operations.type === 'redo') {
      redo(this.cm);
    } else if (operations.type && operations.type === 'search') {
      closeSearchPanel(this.cm) || openSearchPanel(this.cm);
    } else if (
      operations.type !== 'focus-editor' &&
      operations &&
      operations.length
    ) {
      const ranges = this.cm.state.selection.ranges;
      this.cm.dispatch(
        this.cm.state.changeByRange(function (range) {
          let index;
          for (let i = 0; i < ranges.length; i++) {
            if (ranges[i] === range) {
              index = i;
            }
          }
          const editorChanges = [
            {
              // @ts-ignore
              from: operations[index].cutStart,
              // @ts-ignore
              to: operations[index].cutEnd,
              // @ts-ignore
              insert: operations[index].replacement
            }
          ];
          const selectionRange = EditorSelection.range(
            // @ts-ignore
            operations[index].newSelStart,
            // @ts-ignore
            operations[index].newSelEnd
          );
          return {
            changes: editorChanges,
            range: selectionRange
          };
        })
      );
    } else if (
      operations.type !== 'focus-editor' &&
      operations &&
      operations.cutStart &&
      operations.cutEnd &&
      operations.newSelStart &&
      operations.newSelEnd &&
      operations.replacement
    ) {
      this.cm.dispatch(
        this.cm.state.changeByRange(function (range) {
          const editorChanges = [
            {
              from: operations.cutStart,
              to: operations.cutEnd,
              insert: operations.replacement
            }
          ];
          const selectionRange = EditorSelection.range(
            operations.newSelStart,
            operations.newSelEnd
          );
          return {
            changes: editorChanges,
            range: selectionRange
          };
        })
      );
    }
    this.cm.focus();
    return this.cm.state.doc.toString();
  }
}

exports.CodeMirrorEngine = $tw.browser
  ? CodeMirrorEngine
  : require('$:/core/modules/editor/engines/simple.js').SimpleEngine;
