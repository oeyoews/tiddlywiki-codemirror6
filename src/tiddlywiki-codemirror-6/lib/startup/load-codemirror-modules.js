/*\
title: $:/plugins/oeyoews/tiddlywiki-codemirror-6/modules/startup/load-codemirror-modules.js
type: application/javascript
module-type: startup

Load codemirror modules

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  $tw.utils.codemirror = Object.create(null);

  // Export name and synchronous status
  exports.name = 'load-codemirror-modules';
  exports.before = ['load-modules'];
  exports.synchronous = true;

  exports.startup = function () {
    // Load modules
    $tw.modules.applyMethods('codemirror-utils', $tw.utils.codemirror);
  };
})();
