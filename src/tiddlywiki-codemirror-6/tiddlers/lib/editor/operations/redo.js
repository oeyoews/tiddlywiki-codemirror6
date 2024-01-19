/*\
title: $:/plugins/oeyoews/tiddlywiki-codemirror-6/modules/editor/operations/text/redo.js
type: application/javascript
module-type: texteditoroperation

Text editor operation to replace the entire text

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  exports['redo'] = function (event, operation) {
    if (operation instanceof Array) {
      operation.splice(0, operation.length);
      operation.type = 'redo';
    }
  };
})();
