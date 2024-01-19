/*\
title: $:/plugins/oeyoews/tiddlywiki-codemirror-6/edit-codemirror-6.js
type: application/javascript
module-type: widget

Edit-codemirror widget

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  const {
    editTextWidgetFactory
  } = require('$:/core/modules/editor/factory.js');
  const {
    CodeMirrorEngine
  } = require('$:/plugins/oeyoews/tiddlywiki-codemirror-6/engine.js');

  // 工厂函数用法
  exports['edit-codemirror-6'] = editTextWidgetFactory(
    CodeMirrorEngine,
    CodeMirrorEngine
  );
})();
