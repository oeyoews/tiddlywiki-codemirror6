/*\
title: $:/plugins/oeyoews/tiddlywiki-codemirror-6/modules/subclasses/editor/edit-text.js
type: application/javascript
module-type: widget-subclass

Widget base class

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  exports.baseClass = 'edit-codemirror-6';

  exports.constructor = function (parseTreeNode, options) {
    this.initialise(parseTreeNode, options);
  };

  exports.prototype = {};

  exports.prototype.execute = function () {
    this.editType = this.getAttribute('type');
    Object.getPrototypeOf(Object.getPrototypeOf(this)).execute.call(this);
  };

  /*
Handle an edit text operation message from the toolbar
*/
  exports.prototype.handleEditTextOperationMessage = function (event) {
    // Prepare information about the operation
    var operation = this.engine.createTextOperation(event.param);
    // Invoke the handler for the selected operation
    var handler = this.editorOperations[event.param];
    if (handler) {
      handler.call(this, event, operation);
    }
    // Execute the operation via the engine
    var newText = this.engine.executeTextOperation(operation);
    // Fix the tiddler height and save changes
    this.engine.fixHeight();
    this.saveChanges(newText);
  };

  exports.prototype.handlePasteEvent = function (event) {
    if (
      event.clipboardData &&
      event.clipboardData.files &&
      event.clipboardData.files.length
    ) {
      event.preventDefault();
      event.stopPropagation();
      this.dispatchDOMEvent(this.cloneEvent(event, ['clipboardData']));
      return true;
    }
    return false;
  };

  exports.prototype.refresh = function (changedTiddlers) {
    const changedAttributes = this.computeAttributes();

    if (
      Object.keys(changedTiddlers).some((tiddler) =>
        tiddler.startsWith('$:/config/codemirror-6')
      ) ||
      changedAttributes.type
    ) {
      this.refreshSelf();
      return true;
    }
    // Call the base class refresh function
    Object.getPrototypeOf(Object.getPrototypeOf(this)).refresh.call(
      this,
      changedTiddlers
    );
  };
})();
