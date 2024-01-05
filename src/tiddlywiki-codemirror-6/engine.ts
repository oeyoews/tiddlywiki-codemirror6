// @ts-nocheck
import { tags } from '@lezer/highlight';
import {
  indentUnit,
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  HighlightStyle,
  foldKeymap
} from '@codemirror/language';
import setVimKeymap from './utils/vimrc.js';
import { EditorState, EditorSelection, Prec } from '@codemirror/state';
import { materialLight } from '@uiw/codemirror-theme-material';
import {
  searchKeymap,
  highlightSelectionMatches,
  openSearchPanel,
  closeSearchPanel
} from '@codemirror/search';

import {
  completeAnyWord,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
  completionStatus,
  acceptCompletion
} from '@codemirror/autocomplete';

import {
  defaultKeymap,
  indentWithTab,
  history,
  historyKeymap,
  undo,
  redo
} from '@codemirror/commands';

import {
  EditorView,
  dropCursor,
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  rectangularSelection,
  crosshairCursor,
  lineNumbers,
  highlightActiveLineGutter,
  placeholder,
  tooltips
} from '@codemirror/view';

import { vim } from '@replit/codemirror-vim';
import { oneDark } from '@codemirror/theme-one-dark';
import tabSizePlugin from './utils/tab-size.js';
import cmeConfig from './cmeConfig.js';
import autocompletionConfig from './modules/autocompletion-config.js';
import { charsExtension } from './extensions/wordCountExt.js';
import dynamicmode from './modules/mode.js';
import removeOutlineExt from './extensions/removeOutlineExt.js';
import { miniMapExt } from './extensions/miniMapExt.js';
import { underlineSelection } from './extensions/underlineSelection.js';

class CodeMirrorEngine {
  constructor(options) {
    const self = this;
    this.widget = options.widget;
    this.value = options.value;
    this.parentNode = options.parentNode;
    this.nextSibling = options.nextSibling;
    // Create the wrapper DIV
    this.domNode = this.widget.document.createElement('div');
    if (this.widget.editClass) {
      this.domNode.className = this.widget.editClass;
    }

    this.domNode.style.display = 'inline-block';

    this.parentNode.insertBefore(this.domNode, this.nextSibling);
    this.widget.domNodes.push(this.domNode);

    this.editorSelection = EditorSelection;
    this.completionStatus = completionStatus;

    this.undo = undo;
    this.redo = redo;
    this.openSearchPanel = openSearchPanel;
    this.closeSearchPanel = closeSearchPanel;

    this.solarizedLightTheme = EditorView.theme({}, { dark: false });
    this.solarizedDarkTheme = EditorView.theme({}, { dark: true });
    this.solarizedLightHighlightStyle =
      $tw.utils.codemirror.getSolarizedLightHighlightStyle(
        HighlightStyle,
        tags
      );
    this.solarizedDarkHighlightStyle =
      $tw.utils.codemirror.getSolarizedDarkHighlightStyle(HighlightStyle, tags);

    // codemirror extensions
    const cme = [
      charsExtension(),
      dropCursor(),
      tabSizePlugin(),
      removeOutlineExt,
      indentUnit.of('	'),

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
          dragenter(event, view) {
            self.dragCancel = true;
            if (
              self.widget.isFileDropEnabled &&
              ($tw.utils.dragEventContainsFiles(event) ||
                event.dataTransfer.files.length)
            ) {
              event.preventDefault();
              return true;
            }
            return false;
          },
          dragover(event, view) {
            self.dragCancel = true;
            if (
              self.widget.isFileDropEnabled &&
              ($tw.utils.dragEventContainsFiles(event) ||
                event.dataTransfer.files.length)
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
          paste(event, view) {
            if (self.widget.isFileDropEnabled) {
              event['twEditor'] = true;
              return self.widget.handlePasteEvent.call(self.widget, event);
            } else {
              event['twEditor'] = true;
            }
            return false;
          },
          keydown(event, view) {
            return self.handleKeydownEvent(event, view);
          },
          focus(event, view) {
            if (self.widget.editCancelPopups) {
              $tw.popup.cancel(0);
            }
            return false;
          },
          blur(event, view) {
            return false;
          }
        })
      ),
      tooltips({
        parent: self.domNode.ownerDocument.body
      }),
      highlightSpecialChars(),
      history(), //{newGroupDelay: 0, joinToEvent: function() { return false; }}),
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
      Prec.high(
        keymap.of({
          key: 'Tab',
          run: acceptCompletion
        })
      ), // tab for autocomplete accept
      Prec.high(
        keymap.of([
          {
            key: 'Ctrl-i',
            scope: 'editor',
            run: acceptCompletion
          }
        ])
      ),
      // https://discuss.codemirror.net/t/capturing-ctrl-s-doesnt-work-opens-browsers-save-dialog/5228
      // Prec.highest(
      //   keymap.of([
      //     {
      //       key: 'Ctrl-n',
      //       preventDefault: true,
      //       // scope: 'editor',
      //       run: acceptCompletion
      //     }
      //   ])
      // ),
      Prec.high([
        keymap.of([
          {
            key: 'Mod-h',
            preventDefault: true,
            run: underlineSelection
          }
        ])
      ]),
      keymap.of([
        ...closeBracketsKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap
      ]),
      EditorView.lineWrapping, // enable line wrap
      EditorView.contentAttributes.of({
        tabindex: self.widget.editTabIndex ? self.widget.editTabIndex : ''
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

    const { fields = {} } =
      $tw.wiki.getTiddler($tw.wiki.getTiddlerText('$:/palette')) || {};
    const darkMode = fields?.['color-scheme'] === 'dark';

    (cmeConfig.enableOneDarkTheme() && darkMode && cme.push(oneDark)) ||
      cme.push(materialLight);

    if (cmeConfig.indentWithTab()) {
      cme.push(keymap.of([indentWithTab]));
    }

    if (cmeConfig.vimmode()) {
      setVimKeymap();
      cme.push(vim());
    } else {
      cme.push(keymap.of([...defaultKeymap]));
    }

    cmeConfig.completeAnyWord() &&
      cme.push(
        EditorState.languageData.of(() => [{ autocomplete: completeAnyWord }])
      );

    cmeConfig.closeBrackets() && cme.push(closeBrackets());
    cmeConfig.bracketMatching() && cme.push(bracketMatching());
    cmeConfig.lineNumbers() && cme.push(lineNumbers());
    cmeConfig.lineNumbers() && cmeConfig.foldGutter() && cme.push(foldGutter());
    cmeConfig.highlightActiveLine() &&
      cme.push(highlightActiveLineGutter(), highlightActiveLine());

    if (this.widget.editPlaceholder) {
      const defaultPlaceholder = self.widget.editPlaceholder;
      cme.push(placeholder(cmeConfig.placeholder() || defaultPlaceholder));
    }

    let mode = this.widget.editType;

    // add minimap
    miniMapExt(cme);

    // update extensions
    dynamicmode(mode, cme);

    const state = EditorState.create({
      doc: options.value,
      extensions: cme
    });

    // entry
    this.cm = new EditorView({
      parent: this.domNode,
      state
    });
  }

  handleDropEvent(event, view) {
    if (!this.widget.isFileDropEnabled) {
      event.stopPropagation();
      return false;
    }
    if (
      $tw.utils.dragEventContainsFiles(event) ||
      event.dataTransfer.files.length
    ) {
      const dropCursorPos = view.posAtCoords(
        { x: event.clientX, y: event.clientY },
        true
      );
      view.dispatch({
        selection: { anchor: dropCursorPos, head: dropCursorPos }
      });
      event.preventDefault();
      return true;
    }
    return false;
  }

  handleDragEnterEvent(event) {
    return false;
  }

  handleKeydownEvent(event, view) {
    if ($tw.keyboardManager.handleKeydownEvent(event, { onlyPriority: true })) {
      this.dragCancel = false;
      return true;
    }
    if (
      event.keyCode === 27 &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey &&
      !event.metaKey &&
      this.completionStatus(this.cm.state) === 'active'
    ) {
      event.stopPropagation();
      return false;
    }
    let widget = this.widget;
    const keyboardWidgets = [];
    while (widget) {
      if (widget.parseTreeNode.type === 'keyboard') {
        keyboardWidgets.push(widget);
      }
      widget = widget.parentWidget;
    }
    if (keyboardWidgets.length > 0) {
      let handled = undefined;
      for (let i = 0; i < keyboardWidgets.length; i++) {
        const keyboardWidget = keyboardWidgets[i];
        const keyInfoArray = keyboardWidget.keyInfoArray;
        if ($tw.keyboardManager.checkKeyDescriptors(event, keyInfoArray)) {
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
        event.stopPropagation();
        this.dragCancel = false;
        return true;
      }
    }
    this.dragCancel = false;
    return this.widget.handleKeydownEvent.call(this.widget, event);
  }

  /*
  Set the text of the engine if it doesn't currently have focus
  */
  setText(text, type) {
    if (!this.cm.hasFocus) {
      this.updateDomNodeText(text);
    }
  }

  /* Update the DomNode with the new text */
  updateDomNodeText(text) {
    const self = this;
    const selections = this.cm.state.selection;
    this.cm.dispatch(
      this.cm.state.update({
        changes: {
          from: 0,
          to: self.cm.state.doc.length,
          insert: text
        },
        selection: selections,
        docChanged: true
      })
    );
  }

  /* Get the text of the engine */
  getText = function () {
    return this.cm.state.doc.toString();
  };

  /** @description Fix the height of textarea to fit content, 其他的文本操作模块需要用到原型上的方法，比如 editortoolbar */
  fixHeight() {
    this.cm.requestMeasure();
  }

  /* Focus the engine node */
  focus() {
    this.cm.focus();
  }

  /* Create a blank structure representing a text operation */
  createTextOperation(type) {
    const selections = this.cm.state.selection.ranges;
    let operations;
    switch (type) {
      case 'excise':
      case 'focus-editor':
      case 'insert-text':
      case 'make-link':
      case 'prefix-lines':
      case 'redo':
      case 'replace-all':
      case 'replace-selection':
      case 'save-selection':
      case 'search':
      case 'undo':
      case 'wrap-lines':
      case 'wrap-selection':
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
          operation.selection = this.cm.state.sliceDoc(anchorPos, headPos);
          operations.push(operation);
        }
        break;
      default:
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
        break;
    }
    return operations;
  }

  /* Execute a text operation */
  executeTextOperation(operations) {
    const self = this;
    if (operations.type && operations.type === 'undo') {
      this.undo(this.cm);
    } else if (operations.type && operations.type === 'redo') {
      this.redo(this.cm);
    } else if (operations.type && operations.type === 'search') {
      this.closeSearchPanel(this.cm) || this.openSearchPanel(this.cm);
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
              from: operations[index].cutStart,
              to: operations[index].cutEnd,
              insert: operations[index].replacement
            }
          ];
          const selectionRange = self.editorSelection.range(
            operations[index].newSelStart,
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
          const selectionRange = self.editorSelection.range(
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
