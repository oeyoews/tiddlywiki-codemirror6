/*\
title: $:/core/modules/editor/operations/text/make-link.js
type: application/javascript
module-type: texteditoroperation

Text editor operation to make a link

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports["make-link"] = function(event,operation) {
	if(operation instanceof Array) {
		for(var i=0; i<operation.length; i++) {
			var op = operation[i];
			if(op.selection) {
				op.replacement = "[[" + op.selection + "|" + event.paramObject.text + "]]";
				op.cutStart = operation[i].selStart;
				op.cutEnd = operation[i].selEnd;				
			} else {
				op.replacement = "[[" + event.paramObject.text + "]]";
				op.cutStart = operation[i].selStart;
				op.cutEnd = operation[i].selEnd;				
			}
			op.newSelStart = operation[i].selStart + op.replacement.length;
			op.newSelEnd = op.newSelStart;
		}
	} else {
		if(operation.selection) {
			operation.replacement = "[[" + operation.selection + "|" + event.paramObject.text + "]]";
			operation.cutStart = operation.selStart;
			operation.cutEnd = operation.selEnd;
		} else {
			operation.replacement = "[[" + event.paramObject.text + "]]";
			operation.cutStart = operation.selStart;
			operation.cutEnd = operation.selEnd;
		}
		operation.newSelStart = operation.selStart + operation.replacement.length;
		operation.newSelEnd = operation.newSelStart;
	}
};

})();
