/*\
title: $:/plugins/oeyoews/tiddlywiki-cmp/snippets.js
type: application/javascript
module-type: snippets

tiddlywiki-cmp module

\*/
module.exports = [
  {
    title: 'note',
    desc: 'markdown note block',
    text: ':::note\n${2:text}\n:::'
  },
  {
    title: 'tip',
    desc: 'markdown tip block',
    text: ':::tip\n${2:text}\n:::'
  },
  {
    title: 'unsplash-image',
    text: '[img[https://source.unsplash.com/random/1920x1080?fm=blurhash&${1:sea}]]#{2}',
    desc: 'unsplash random image'
  }
];
