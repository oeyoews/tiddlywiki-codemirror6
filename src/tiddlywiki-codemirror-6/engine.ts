// @ts-nocheck
import { EditorState, EditorSelection, Extension } from '@codemirror/state';
import { openSearchPanel, closeSearchPanel } from '@codemirror/search';
import { Vim, getCM } from '@replit/codemirror-vim';

import cm6 from './config';
import { completionStatus } from '@codemirror/autocomplete';
import { undo, redo } from '@codemirror/commands';

import { EditorView } from '@codemirror/view';

import handleLanguageMode from '@/cm6/modules/mode';
import { miniMapExt as setMinMapExt } from '@/cm6/modules/extensions/miniMapExt';
import setExtensions from '@/cm6/modules/extensions';
import {
  type IOperation,
  type IOperationType,
  operationTypes
} from '@/cm6/modules/constants/operationTypes';
import { type TW_Element } from 'tiddlywiki';
import type { IWidget } from '@/cm6/types/IWidget';
import inlineSuggestionExt from '@/cm6/modules//extensions/inlinesuggest';
import { cme } from '@/cm6/modules/extensions/basic';

class CodeMirrorEngine {
  domNode: TW_Element;
  parentNode: Node;
  nextSibling: Node;

  private widget: IWidget;
  /** extensions */
  private cme: Extension[] = [];
  private editor: EditorView;
  private state: EditorState;
  private dragCancel: boolean = false;
  private maxHeight: string = '';

  constructor(options = {} as IOptions) {
    this.widget = options.widget;
    this.parentNode = options.parentNode;
    this.nextSibling = options.nextSibling;

    this.domNode = this.widget.document.createElement('div');
    this.maxHeight = $tw.wiki.getTiddlerText(
      '$:/config/codemirror-6/EditorHeight'
    )!;

    this.domNode.style.maxHeight = this.maxHeight;
    this.domNode.style.overflow = 'auto';

    this.parentNode.insertBefore(this.domNode, this.nextSibling);
    this.widget.domNodes.push(this.domNode);

    this.domNode.className = this.widget.editClass ? this.widget.editClass : '';
    this.domNode.style.display = 'inline-block';

    // 添加扩展
    this.cme = cme(this);
    // 设置语言
    handleLanguageMode(options.type, this.cme, this.widget, this);
    // 添加扩展集合
    setExtensions(this.cme, this.widget, this.editor);
    // 小地图配置
    setMinMapExt(this.cme);
    inlineSuggestionExt(this);

    // 初始化
    this.state = EditorState.create({
      doc:
        options.value ||
        '\n'.repeat(
          Math.abs(
            Number(cm6.lines() - 1) >= 0 && cm6.lines() < 20
              ? cm6.lines() - 1
              : 0
          )
        ),
      extensions: this.cme
    });

    // main: create a codemirror6 instance
    this.editor = new EditorView({
      parent: this.domNode,
      state: this.state
      // selection: {
      //   anchor: 1,
      //   head: 3
      // },
    });
    // @see https://github.com/replit/codemirror-vim/issues/6
    if (cm6.vimmode() && cm6.insertModeFirst() && !options.value) {
      let editor = getCM(this.editor);
      Vim.exitInsertMode(editor);
      Vim.handleKey(editor, 'i');
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
      completionStatus(this.editor.state) === 'active'
    ) {
      e.stopPropagation();
      return false;
    }

    // NOTE: snippets use `ctrl-s`, now it is disabled, ctrn-n 仍然挡不住
    if (e.ctrlKey && e.key === 's') {
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

  /** @description Set the text of the engine if it doesn't currently have focus */
  setText(text: string) {
    if (!this.editor.hasFocus) {
      this.updateDomNodeText(text);
    }
  }

  /** @description Update the DomNode with the new text */
  updateDomNodeText(text: string) {
    const selections = this.editor.state.selection;
    // NOTE: prevent ranger error
    try {
      this.editor.dispatch(
        this.editor.state.update({
          changes: {
            from: 0,
            to: this.editor.state.doc.length,
            insert: text
          },
          selection: selections,
          // @ts-ignore
          docChanged: true
        })
      );
    } catch (e) {
      // console.warn(e);
    }
  }

  /** @description Get the text of the engine */
  getText() {
    return this.editor.state.doc.toString();
  }

  /** @description Fix the height of textarea to fit content, 其他的文本操作模块需要用到原型上的方法，比如 editortoolbar */
  fixHeight() {
    this.editor.requestMeasure();
  }

  /* Focus the engine node */
  focus() {
    this.editor.focus();
  }

  /** @description Create a blank structure representing a text operation */
  createTextOperation(type: IOperationType) {
    const selections = this.editor.state.selection.ranges;
    let operations;
    if (operationTypes.includes(type)) {
      operations = [];
      for (let i = 0; i < selections.length; i++) {
        const anchorPos = selections[i].from,
          headPos = selections[i].to;
        const operation = {
          text: this.editor.state.doc.toString(),
          selStart: anchorPos,
          selEnd: headPos,
          cutStart: null,
          cutEnd: null,
          replacement: null,
          newSelStart: null,
          newSelEnd: null
        };
        // @ts-ignore
        operation.selection = this.editor.state.sliceDoc(anchorPos, headPos);
        operations.push(operation);
      }
    } else {
      operations = {
        text: this.editor.state.doc.toString(),
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
      undo(this.editor);
    } else if (operations.type && operations.type === 'redo') {
      redo(this.editor);
    } else if (operations.type && operations.type === 'search') {
      closeSearchPanel(this.editor) || openSearchPanel(this.editor);
    } else if (
      operations.type !== 'focus-editor' &&
      operations &&
      operations.length
    ) {
      const ranges = this.editor.state.selection.ranges;
      this.editor.dispatch(
        this.editor.state.changeByRange(function (range) {
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
      this.editor.dispatch(
        this.editor.state.changeByRange(function (range) {
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
    this.editor.focus();
    return this.getText();
  }
}

const { SimpleEngine } = require('$:/core/modules/editor/engines/simple.js');

exports.CodeMirrorEngine = $tw.browser ? CodeMirrorEngine : SimpleEngine;
