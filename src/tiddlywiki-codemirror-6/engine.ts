// @ts-nocheck

import {
  HighlightStyle,
  indentUnit,
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
  language
} from '@codemirror/language';

import { html, htmlLanguage } from '@codemirror/lang-html';
import { json, jsonLanguage } from '@codemirror/lang-json';
import { css, cssLanguage } from '@codemirror/lang-css';

import {
  markdown,
  markdownLanguage,
  markdownKeymap
} from '@codemirror/lang-markdown';

import { javascript, javascriptLanguage } from '@codemirror/lang-javascript';

import {
  Compartment,
  EditorState,
  EditorSelection,
  Prec
} from '@codemirror/state';

import {
  searchKeymap,
  highlightSelectionMatches,
  openSearchPanel,
  closeSearchPanel
} from '@codemirror/search';

import {
  autocompletion,
  CompletionContext,
  completeAnyWord,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
  completionStatus,
  acceptCompletion
} from '@codemirror/autocomplete';

import { lintKeymap } from '@codemirror/lint';
import {
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
  tooltips,
  ViewPlugin
} from '@codemirror/view';
import { tags } from '@lezer/highlight';
import { Vim, vim } from '@replit/codemirror-vim';
import { oneDark } from '@codemirror/theme-one-dark';

class CodeMirrorEngine {
  // @ts-ignore
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

    this.solarizedLightTheme = EditorView.theme({ dark: false });
    this.solarizedDarkTheme = EditorView.theme({ dark: true });

    // remove editor outline style
    this.removeEditorOutline = EditorView.theme({
      '&.cm-focused': {
        outline: 'none'
      }
    });

    this.solarizedLightHighlightStyle =
      $tw.utils.codemirror.getSolarizedLightHighlightStyle(
        HighlightStyle,
        tags
      );
    this.solarizedDarkHighlightStyle =
      $tw.utils.codemirror.getSolarizedDarkHighlightStyle(HighlightStyle, tags);

    const autoCloseBrackets =
      this.widget.wiki.getTiddlerText(
        '$:/config/codemirror-6/closeBrackets'
      ) === 'yes';

    // 自动选中
    const selectOnOpen =
      this.widget.wiki.getTiddlerText('$:/config/codemirror-6/selectOnOpen') ===
      'yes';
    const autocompleteIcons =
      this.widget.wiki.getTiddlerText(
        '$:/config/codemirror-6/autocompleteIcons'
      ) === 'yes';
    // 最大补全数
    const maxRenderedOptions = parseInt(
      this.widget.wiki.getTiddlerText(
        '$:/config/codemirror-6/maxRenderedOptions'
      )
    );

    // 检测文档大小
    const docSizePlugin = ViewPlugin.fromClass(
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
    const languageConf = new Compartment();

    // 自动语言检测
    const autoLanguage = EditorState.transactionExtender.of((tr) => {
      if (!tr.docChanged) return null;
      let docIsHTML = /^\s*</.test(tr.newDoc.sliceString(0, 100));
      let stateIsHTML = tr.startState.facet(language) == htmlLanguage;
      if (docIsHTML == stateIsHTML) return null;
      return {
        effects: languageConf.reconfigure(docIsHTML ? html() : javascript())
      };
    });

    const editorExtensions = [
      docSizePlugin,
      // autoLanguage, // 不好用，语法高亮
      // languageConf.of(javascript(), markdown({base: markdownLanguage})),
      dropCursor(),
      // solarizedTheme,
      oneDark,
      // Prec.high(syntaxHighlighting(oneDarkHighlightStyle)),
      this.removeEditorOutline,

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
      // basicSetup,
      highlightSpecialChars(),
      history(), //{newGroupDelay: 0, joinToEvent: function() { return false; }}),
      drawSelection(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      // 自动补全
      autocompletion({
        tooltipClass: function () {
          return 'cm-autocomplete-tooltip';
        },
        selectOnOpen,
        // override: [this.widgetCompletions],
        icons: autocompleteIcons,
        maxRenderedOptions
      }), //{activateOnTyping: false, closeOnBlur: false}),
      rectangularSelection(),
      crosshairCursor(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap
      ]),
      Prec.high(keymap.of({ key: 'Tab', run: acceptCompletion })),
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({
        tabindex: self.widget.editTabIndex ? self.widget.editTabIndex : ''
      }),
      EditorView.contentAttributes.of({
        spellcheck:
          self.widget.wiki.getTiddlerText(
            '$:/config/codemirror-6/spellcheck'
          ) === 'yes'
      }),
      EditorView.contentAttributes.of({
        autocorrect:
          self.widget.wiki.getTiddlerText(
            '$:/config/codemirror-6/autocorrect'
          ) === 'yes'
      }),
      EditorView.contentAttributes.of({
        translate:
          self.widget.wiki.getTiddlerText(
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

    if (
      this.widget.wiki.getTiddlerText(
        '$:/config/codemirror-6/indentWithTab'
      ) === 'yes'
    ) {
      editorExtensions.push(keymap.of([indentWithTab]));
    }

    // vim extension
    Vim.map('jk', '<Esc>', 'insert'); // in insert mode
    Vim.map('H', '0', 'normal');
    Vim.map('L', '$', 'normal');

    editorExtensions.push(vim());

    if (
      this.widget.wiki.getTiddlerText(
        '$:/config/codemirror-6/completeAnyWord'
      ) === 'yes'
    ) {
      editorExtensions.push(
        EditorState.languageData.of(function () {
          return [{ autocomplete: completeAnyWord }];
        })
      );
    }

    if (autoCloseBrackets) {
      editorExtensions.push(closeBrackets());
    }

    if (
      this.widget.wiki.getTiddlerText(
        '$:/config/codemirror-6/bracketMatching'
      ) === 'yes'
    ) {
      editorExtensions.push(bracketMatching());
    }

    if (
      this.widget.wiki.getTiddlerText('$:/config/codemirror-6/lineNumbers') ===
      'yes'
    ) {
      editorExtensions.push(lineNumbers());
      editorExtensions.push(foldGutter());
    }

    if (
      this.widget.wiki.getTiddlerText(
        '$:/config/codemirror-6/highlightActiveLine'
      ) === 'yes'
    ) {
      editorExtensions.push(highlightActiveLine());
      editorExtensions.push(highlightActiveLineGutter());
    }

    if (this.widget.editPlaceholder) {
      editorExtensions.push(placeholder(self.widget.editPlaceholder));
    }

    const cmIndentUnit = '	';
    editorExtensions.push(indentUnit.of(cmIndentUnit));

    let mode = this.widget.editType;

    if (mode === '') {
      mode = 'text/vnd.tiddlywiki';
    }
    let actionCompletions = undefined;

    switch (mode) {
      // case 'text/vnd.tiddlywiki':
      //   editorExtensions.push(tiddlywiki());
      //   const actionCompletions = tiddlywikiLanguage.data.of({
      //   });
      //   editorExtensions.push(Prec.high(actionCompletions));
      //   break;
      case 'text/html':
        editorExtensions.push(html({ selfClosingTags: true }));
        actionCompletions = htmlLanguage.data.of({});
        editorExtensions.push(Prec.high(actionCompletions));
        break;

      case 'application/javascript':
        editorExtensions.push(javascript());
        actionCompletions = javascriptLanguage.data.of({});
        editorExtensions.push(Prec.high(actionCompletions));
        /*editorExtensions.push(
						javascriptLanguage.data.of({
							autocomplete: scopeCompletionSource(globalThis)
						})
					);*/
        break;
      case 'application/json':
        editorExtensions.push(json());
        actionCompletions = jsonLanguage.data.of({});
        editorExtensions.push(Prec.high(actionCompletions));
        break;
      case 'text/css':
        editorExtensions.push(css());
        actionCompletions = cssLanguage.data.of({});
        editorExtensions.push(Prec.high(actionCompletions));
        break;
      case 'text/markdown':
      case 'text/x-markdown':
        editorExtensions.push(markdown({ base: markdownLanguage }));
        actionCompletions = markdownLanguage.data.of({
          // autocomplete: [...widgetSnippets]
          // autocomplete: this.widgetCompletions
        });
        editorExtensions.push(Prec.high(actionCompletions));
        editorExtensions.push(Prec.high(keymap.of(markdownKeymap)));
        break;
      default:
        break;
    }

    const state = EditorState.create({
      doc: options.value, // editor 文本输入
      extensions: editorExtensions
    });
    // TODO: not work
    // EditorState.tabSize = 2;

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

  /*
  Update the DomNode with the new text
  */
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

  /*
  Get the text of the engine
  */
  getText = function () {
    return this.cm.state.doc.toString();
  };

  /*
  Fix the height of textarea to fit content
  */
  fixHeight() {
    this.cm.requestMeasure();
  }

  /*
  Focus the engine node
  */
  focus() {
    this.cm.focus();
  }

  /*
  Create a blank structure representing a text operation
  */
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

  /*
  Execute a text operation
  */
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

  widgetCompletions(context: CompletionContext) {
    const { widgetSnippets } = require('./utils/getAllWidget.js');
    // 最小补全 length
    let word = context.matchBefore(/\w*/);
    if (word.from == word.to && !context.explicit) return null;
    return {
      from: word.from,
      options: [
        // { label: 'match', type: 'keyword' },
        // { label: 'hello', type: 'variable', info: '(World)' },
        // { label: 'magic', type: 'text', apply: '⠁⭒*.✩.*⭒⠁', detail: 'macro' },
        ...widgetSnippets
      ]
    };
  }
}

exports.CodeMirrorEngine = $tw.browser
  ? CodeMirrorEngine
  : require('$:/core/modules/editor/engines/simple.js').SimpleEngine;
