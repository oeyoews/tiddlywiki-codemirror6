/*\
title: $:/core/modules/editor/operations/text/replace-all.js
type: application/javascript
module-type: texteditoroperation

Text editor operation to replace the entire text

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports["replace-all"] = function(event,operation) {
	if(operation instanceof Array) {
		for(var i=0; i<operation.length; i++) {
			var op = operation[i];
			op.cutStart = 0;
			op.cutEnd = op.text.length;
			op.replacement = event.paramObject.text;
			op.newSelStart = 0;
			op.newSelEnd = op.replacement.length;
		}
	} else {
		operation.cutStart = 0;
		operation.cutEnd = operation.text.length;
		operation.replacement = event.paramObject.text;
		operation.newSelStart = 0;
		operation.newSelEnd = operation.replacement.length;
	}
};

})();
