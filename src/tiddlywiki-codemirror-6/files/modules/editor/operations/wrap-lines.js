/*\
title: $:/core/modules/editor/operations/text/wrap-lines.js
type: application/javascript
module-type: texteditoroperation

Text editor operation to wrap the selected lines with a prefix and suffix

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  exports['wrap-lines'] = function (event, operation) {
    var prefix = event.paramObject.prefix || '',
      suffix = event.paramObject.suffix || '';
    if (operation instanceof Array) {
      for (var i = 0; i < operation.length; i++) {
        var op = operation[i];
        if (
          $tw.utils.endsWith(
            op.text.substring(0, op.selStart),
            prefix + '\n',
          ) &&
          $tw.utils.startsWith(op.text.substring(op.selEnd), '\n' + suffix)
        ) {
          // Selected text is already surrounded by prefix and suffix: Remove them
          // Cut selected text plus prefix and suffix
          op.cutStart = op.selStart - (prefix.length + 1);
          op.cutEnd = op.selEnd + suffix.length + 1;
          // Also cut the following newline (if there is any)
          if (op.text[op.cutEnd] === '\n') {
            op.cutEnd++;
          }
          // Replace with selection
          op.replacement = op.text.substring(op.selStart, op.selEnd);
          // Select text that was in between prefix and suffix
          op.newSelStart = op.cutStart;
          op.newSelEnd = op.selEnd - (prefix.length + 1);
        } else {
          // Cut just past the preceding line break, or the start of the text
          op.cutStart = $tw.utils.findPrecedingLineBreak(op.text, op.selStart);
          // Cut to just past the following line break, or to the end of the text
          op.cutEnd = $tw.utils.findFollowingLineBreak(op.text, op.selEnd);
          // Add the prefix and suffix
          op.replacement =
            prefix +
            '\n' +
            op.text.substring(op.cutStart, op.cutEnd) +
            '\n' +
            suffix +
            '\n';
          op.newSelStart = op.cutStart + prefix.length + 1;
          op.newSelEnd = op.newSelStart + (op.cutEnd - op.cutStart);
        }
      }
    } else {
      if (
        $tw.utils.endsWith(
          operation.text.substring(0, operation.selStart),
          prefix + '\n',
        ) &&
        $tw.utils.startsWith(
          operation.text.substring(operation.selEnd),
          '\n' + suffix,
        )
      ) {
        // Selected text is already surrounded by prefix and suffix: Remove them
        // Cut selected text plus prefix and suffix
        operation.cutStart = operation.selStart - (prefix.length + 1);
        operation.cutEnd = operation.selEnd + suffix.length + 1;
        // Also cut the following newline (if there is any)
        if (operation.text[operation.cutEnd] === '\n') {
          operation.cutEnd++;
        }
        // Replace with selection
        operation.replacement = operation.text.substring(
          operation.selStart,
          operation.selEnd,
        );
        // Select text that was in between prefix and suffix
        operation.newSelStart = operation.cutStart;
        operation.newSelEnd = operation.selEnd - (prefix.length + 1);
      } else {
        // Cut just past the preceding line break, or the start of the text
        operation.cutStart = $tw.utils.findPrecedingLineBreak(
          operation.text,
          operation.selStart,
        );
        // Cut to just past the following line break, or to the end of the text
        operation.cutEnd = $tw.utils.findFollowingLineBreak(
          operation.text,
          operation.selEnd,
        );
        // Add the prefix and suffix
        operation.replacement =
          prefix +
          '\n' +
          operation.text.substring(operation.cutStart, operation.cutEnd) +
          '\n' +
          suffix +
          '\n';
        operation.newSelStart = operation.cutStart + prefix.length + 1;
        operation.newSelEnd =
          operation.newSelStart + (operation.cutEnd - operation.cutStart);
      }
    }
  };
})();
