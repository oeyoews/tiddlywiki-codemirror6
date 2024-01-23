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
  const EDITOR_MAPPING_PREFIX = '$:/config/EditorTypeMappings/';

  exports.constructor = function (parseTreeNode, options) {
    this.initialise(parseTreeNode, options);
  };

  exports.prototype = {};

  exports.prototype.execute = function () {
    this.editType = this.getAttribute('type');
    Object.getPrototypeOf(Object.getPrototypeOf(this)).execute.call(this);
  };

  exports.prototype.getEditorType = function () {
    // Get the content type of the thing we're editing
    var type;
    if (this.editField === 'text') {
      var tiddler = this.wiki.getTiddler(this.editTitle);
      if (tiddler) {
        type = tiddler.fields.type;
      }
    }
    type = type || 'text/vnd.tiddlywiki';
    var editorType = this.wiki.getTiddlerText(EDITOR_MAPPING_PREFIX + type);
    if (!editorType) {
      var typeInfo = $tw.config.contentTypeInfo[type];
      if (typeInfo && typeInfo.encoding === 'base64') {
        editorType = 'binary';
      } else {
        editorType = 'text';
      }
    }
    return editorType;
  };

  // TODO: use https://codemirror.net/examples/config compartment or appendconfig
  // to support cm6 hmr config
  exports.prototype.refresh = function (changedTiddlers) {
    var changedAttributes = this.computeAttributes();
    if (changedAttributes.type || this.getEditorType() !== this.editorType) {
      this.refreshSelf();
      return true;
    }
    Object.getPrototypeOf(Object.getPrototypeOf(this)).refresh.call(
      this,
      changedTiddlers
    );
  };
})();
