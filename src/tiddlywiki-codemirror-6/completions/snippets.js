// wikitext

// markdown

// js

// TODO: 单独成插件。

export const usersnippets = [
  {
    title: 'codeblcok',
    text: '```${1:lang}\n${2:code}\n```'
  },
  {
    title: 'date',
    text: `${new Date().toLocaleDateString()}`
  },
  {
    title: 'time',
    text: `${new Date().toLocaleString()}`
  }
];

// general words

export const words = ['tiddlywiki', 'GitHub'];
