/*\
title: $:/plugins/oeyoews/tiddlywiki-codemirror-6/modules/subclasses/editor/edit.js
type: application/javascript
module-type: widget-subclass

Widget base class

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  exports.baseClass = 'edit';

  exports.constructor = function (parseTreeNode, options) {
    this.initialise(parseTreeNode, options);
  };

  exports.prototype = {};

  exports.prototype.execute = function () {
    this.editType = this.getAttribute('type');
    Object.getPrototypeOf(Object.getPrototypeOf(this)).execute.call(this);
  };

  // TODO: use https://codemirror.net/examples/config compartment or appendconfig
  // to support cm6 hmr config
  exports.prototype.refresh = function (changedTiddlers) {
    var changedAttributes = this.computeAttributes();
    if (changedAttributes.type) {
      this.refreshSelf();
      return true;
    }
    Object.getPrototypeOf(Object.getPrototypeOf(this)).refresh.call(
      this,
      changedTiddlers
    );
  };
})();