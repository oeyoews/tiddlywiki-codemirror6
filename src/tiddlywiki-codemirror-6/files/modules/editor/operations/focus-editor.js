/*\
title: $:/core/modules/editor/operations/text/focus-editor.js
type: application/javascript
module-type: texteditoroperation
Simply focus the Text editor
\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  exports['focus-editor'] = function (event, operation) {
    if (operation instanceof Array) {
      operation.splice(0, operation.length);
      operation.type = 'focus-editor';
    } else {
      operation = null;
    }
  };
})();
