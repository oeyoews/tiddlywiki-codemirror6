/*\
title: $:/plugins/BTC/tiddlywiki-codemirror-6/modules/subclasses/dropzone.js
type: application/javascript
module-type: widget-subclass

Widget base class

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  exports.baseClass = 'dropzone';

  exports.constructor = function (parseTreeNode, options) {
    this.initialise(parseTreeNode, options);
  };

  exports.prototype = {};

  exports.prototype.handleDragEnterEvent = function (event) {
    if ($tw.dragInProgress) {
      return false;
    }
    // Tell the browser that we're ready to handle the drop
    event.preventDefault();
    // Tell the browser not to ripple the drag up to any parent drop handlers
    event.stopPropagation();
    if (this.filesOnly && !$tw.utils.dragEventContainsFiles(event)) {
      return false;
    }
    this.enterDrag(event);
  };
})();
