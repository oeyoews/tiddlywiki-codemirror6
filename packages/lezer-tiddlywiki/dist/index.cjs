'use strict';

var parser_js = require('./parser.js');
var highlight_js = require('./highlight.js');



Object.defineProperty(exports, "parser", {
	enumerable: true,
	get: function () { return parser_js.parser; }
});
Object.defineProperty(exports, "tiddlywikiHighlighting", {
	enumerable: true,
	get: function () { return highlight_js.tiddlywikiHighlighting; }
});
