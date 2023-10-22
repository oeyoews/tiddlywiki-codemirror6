/*\
title: $:/core/modules/editor/operations/text/replace-selection.js
type: application/javascript
module-type: texteditoroperation

Text editor operation to replace the selection

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  exports['replace-selection'] = function (event, operation) {
    if (operation instanceof Array) {
      for (var i = 0; i < operation.length; i++) {
        var op = operation[i];
        op.replacement = event.paramObject.text;
        op.cutStart = operation[i].selStart;
        op.cutEnd = operation[i].selEnd;
        op.newSelStart = operation[i].selStart;
        op.newSelEnd = operation[i].selStart + op.replacement.length;
      }
    } else {
      operation.replacement = event.paramObject.text;
      operation.cutStart = operation.selStart;
      operation.cutEnd = operation.selEnd;
      operation.newSelStart = operation.selStart;
      operation.newSelEnd = operation.selStart + operation.replacement.length;
    }
  };
})();
