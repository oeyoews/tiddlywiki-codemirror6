/*\
title: $:/plugins/oeyoews/tiddlywiki-cmp/snippets.js
type: application/javascript
module-type: snippets

tiddlywiki-cmp module

\*/

module.exports = [
  {
    title: 'username',
    text: $tw.wiki.getTiddlerText('$:/status/UserName'),
    desc: 'insert your username'
  }
];
