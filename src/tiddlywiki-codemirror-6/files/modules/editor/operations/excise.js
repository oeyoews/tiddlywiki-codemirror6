/*\
title: $:/core/modules/editor/operations/text/excise.js
type: application/javascript
module-type: texteditoroperation

Text editor operation to excise the selection to a new tiddler

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  exports['excise'] = function (event, operation) {
    var editTiddler = this.wiki.getTiddler(this.editTitle),
      editTiddlerTitle = this.editTitle;
    if (editTiddler && editTiddler.fields['draft.of']) {
      editTiddlerTitle = editTiddler.fields['draft.of'];
    }
    if (operation instanceof Array) {
      for (var i = 0; i < operation.length; i++) {
        var op = operation[i];
        var excisionTitle =
          event.paramObject.title && event.paramObject.title !== ''
            ? this.wiki.generateNewTitle(event.paramObject.title)
            : this.wiki.generateNewTitle('New Excision');
        this.wiki.addTiddler(
          new $tw.Tiddler(
            this.wiki.getCreationFields(),
            this.wiki.getModificationFields(),
            {
              title: excisionTitle,
              text: op.selection,
              tags:
                event.paramObject.tagnew === 'yes' ? [editTiddlerTitle] : [],
            },
          ),
        );
        op.replacement = excisionTitle;
        switch (event.paramObject.type || 'transclude') {
          case 'transclude':
            op.replacement = '{{' + op.replacement + '}}';
            break;
          case 'link':
            op.replacement = '[[' + op.replacement + ']]';
            break;
          case 'macro':
            op.replacement =
              '<<' +
              (event.paramObject.macro || 'translink') +
              ' """' +
              op.replacement +
              '""">>';
            break;
        }
        op.cutStart = operation[i].selStart;
        op.cutEnd = operation[i].selEnd;
        op.newSelStart = operation[i].selStart;
        op.newSelEnd = operation[i].selStart + operation[i].replacement.length;
      }
    } else {
      var excisionTitle =
        event.paramObject.title || this.wiki.generateNewTitle('New Excision');
      this.wiki.addTiddler(
        new $tw.Tiddler(
          this.wiki.getCreationFields(),
          this.wiki.getModificationFields(),
          {
            title: excisionTitle,
            text: operation.selection,
            tags: event.paramObject.tagnew === 'yes' ? [editTiddlerTitle] : [],
          },
        ),
      );
      operation.replacement = excisionTitle;
      switch (event.paramObject.type || 'transclude') {
        case 'transclude':
          operation.replacement = '{{' + operation.replacement + '}}';
          break;
        case 'link':
          operation.replacement = '[[' + operation.replacement + ']]';
          break;
        case 'macro':
          operation.replacement =
            '<<' +
            (event.paramObject.macro || 'translink') +
            ' """' +
            operation.replacement +
            '""">>';
          break;
      }
      operation.cutStart = operation.selStart;
      operation.cutEnd = operation.selEnd;
      operation.newSelStart = operation.selStart;
      operation.newSelEnd = operation.selStart + operation.replacement.length;
    }
  };
})();
