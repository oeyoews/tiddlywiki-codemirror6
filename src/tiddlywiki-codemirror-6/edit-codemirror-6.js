/*\
title: $:/plugins/BTC/tiddlywiki-codemirror-6/edit-codemirror-6.js
type: application/javascript
module-type: widget

Edit-codemirror widget

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  var editTextWidgetFactory =
      require('$:/core/modules/editor/factory.js').editTextWidgetFactory,
    CodeMirrorEngine =
      require('$:/plugins/BTC/tiddlywiki-codemirror-6/engine.js').CodeMirrorEngine;

  exports['edit-codemirror-6'] = editTextWidgetFactory(
    CodeMirrorEngine,
    CodeMirrorEngine
  );
})();
