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
    text: `${new Date().toISOString().split('T')[0]}`
  },
  {
    title: 'time',
    text: `${new Date().toISOString().split('.')[0].replace('T', ' ')}`
  }
];

// general words

export const words = ['tiddlywiki', 'GitHub'];
