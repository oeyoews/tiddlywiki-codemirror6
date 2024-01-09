/*\
title: $:/plugins/oeyoews/tiddlywiki-codemirror-6/modules/utils/codemirror-misc-utils.js
type: application/javascript
module-type: codemirror-utils

\*/

(function () {
  exports.validateRegex = function (regex) {
    try {
      new RegExp(regex);
      return true;
    } catch (e) {
      return false;
    }
  };
})();
