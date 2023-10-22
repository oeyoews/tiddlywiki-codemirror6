/*\
title: $:/core/modules/editor/operations/text/insert-text.js
type: application/javascript
module-type: texteditoroperation

Text editor operation insert text at the caret position. If there is a selection it is replaced.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports["insert-text"] = function(event,operation) {
	if(operation instanceof Array) {
		for(var i=0; i<operation.length; i++) {
			var op = operation[i];
			op.replacement = event.paramObject.text;
			op.cutStart = operation[i].selStart;
			op.cutEnd = operation[i].selEnd;
			op.newSelStart = operation[i].selStart + op.replacement.length;
			op.newSelEnd = op.newSelStart;
		}
	} else {
		operation.replacement = event.paramObject.text;
		operation.cutStart = operation.selStart;
		operation.cutEnd = operation.selEnd;
		operation.newSelStart = operation.selStart + operation.replacement.length;
		operation.newSelEnd = operation.newSelStart;
	}
};

})();
