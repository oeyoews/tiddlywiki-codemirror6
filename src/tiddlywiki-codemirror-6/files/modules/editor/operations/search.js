/*\
title: $:/plugins/BTC/tiddlywiki-codemirror-6/modules/editor/operations/text/search.js
type: application/javascript
module-type: texteditoroperation

Text editor operation to replace the entire text

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  exports['search'] = function (event, operation) {
    if (operation instanceof Array) {
      operation.splice(0, operation.length);
      operation.type = 'search';
    }
  };
})();
