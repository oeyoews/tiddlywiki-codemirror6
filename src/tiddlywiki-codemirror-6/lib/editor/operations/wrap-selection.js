/*\
title: $:/core/modules/editor/operations/text/wrap-selection.js
type: application/javascript
module-type: texteditoroperation

Text editor operation to wrap the selection with the specified prefix and suffix

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  exports['wrap-selection'] = function (event, operation) {
    if (operation instanceof Array) {
      for (var i = 0; i < operation.length; i++) {
        var op = operation[i];
        if (op.selStart === op.selEnd) {
          // No selection; check if we're within the prefix/suffix
          if (
            op.text.substring(
              op.selStart - event.paramObject.prefix.length,
              op.selStart + event.paramObject.suffix.length
            ) ===
            event.paramObject.prefix + event.paramObject.suffix
          ) {
            // Remove the prefix and suffix
            op.cutStart =
              operation[i].selStart - event.paramObject.prefix.length;
            op.cutEnd = operation[i].selEnd + event.paramObject.suffix.length;
            op.replacement = '';
            op.newSelStart = op.cutStart;
            op.newSelEnd = op.newSelStart;
          } else {
            // Wrap the cursor instead
            op.cutStart = operation[i].selStart;
            op.cutEnd = operation[i].selEnd;
            op.replacement =
              event.paramObject.prefix + event.paramObject.suffix;
            op.newSelStart =
              operation[i].selStart + event.paramObject.prefix.length;
            op.newSelEnd = op.newSelStart;
          }
        } else if (
          op.text.substring(
            op.selStart,
            op.selStart + event.paramObject.prefix.length
          ) === event.paramObject.prefix &&
          op.text.substring(
            op.selEnd - event.paramObject.suffix.length,
            op.selEnd
          ) === event.paramObject.suffix
        ) {
          // Prefix and suffix are already present, so remove them
          op.cutStart = operation[i].selStart;
          op.cutEnd = operation[i].selEnd;
          op.replacement = op.selection.substring(
            event.paramObject.prefix.length,
            op.selection.length - event.paramObject.suffix.length
          );
          op.newSelStart = operation[i].selStart;
          op.newSelEnd = operation[i].selStart + op.replacement.length;
        } else {
          // Add the prefix and suffix
          op.cutStart = operation[i].selStart;
          op.cutEnd = operation[i].selEnd;
          op.replacement =
            event.paramObject.prefix + op.selection + event.paramObject.suffix;
          op.newSelStart = operation[i].selStart;
          op.newSelEnd = operation[i].selStart + op.replacement.length;
        }
      }
    } else {
      if (operation.selStart === operation.selEnd) {
        // No selection; check if we're within the prefix/suffix
        if (
          operation.text.substring(
            operation.selStart - event.paramObject.prefix.length,
            operation.selStart + event.paramObject.suffix.length
          ) ===
          event.paramObject.prefix + event.paramObject.suffix
        ) {
          // Remove the prefix and suffix
          operation.cutStart =
            operation.selStart - event.paramObject.prefix.length;
          operation.cutEnd = operation.selEnd + event.paramObject.suffix.length;
          operation.replacement = '';
          operation.newSelStart = operation.cutStart;
          operation.newSelEnd = operation.newSelStart;
        } else {
          // Wrap the cursor instead
          operation.cutStart = operation.selStart;
          operation.cutEnd = operation.selEnd;
          operation.replacement =
            event.paramObject.prefix + event.paramObject.suffix;
          operation.newSelStart =
            operation.selStart + event.paramObject.prefix.length;
          operation.newSelEnd = operation.newSelStart;
        }
      } else if (
        operation.text.substring(
          operation.selStart,
          operation.selStart + event.paramObject.prefix.length
        ) === event.paramObject.prefix &&
        operation.text.substring(
          operation.selEnd - event.paramObject.suffix.length,
          operation.selEnd
        ) === event.paramObject.suffix
      ) {
        // Prefix and suffix are already present, so remove them
        operation.cutStart = operation.selStart;
        operation.cutEnd = operation.selEnd;
        operation.replacement = operation.selection.substring(
          event.paramObject.prefix.length,
          operation.selection.length - event.paramObject.suffix.length
        );
        operation.newSelStart = operation.selStart;
        operation.newSelEnd = operation.selStart + operation.replacement.length;
      } else {
        // Add the prefix and suffix
        operation.cutStart = operation.selStart;
        operation.cutEnd = operation.selEnd;
        operation.replacement =
          event.paramObject.prefix +
          operation.selection +
          event.paramObject.suffix;
        operation.newSelStart = operation.selStart;
        operation.newSelEnd = operation.selStart + operation.replacement.length;
      }
    }
  };
})();
