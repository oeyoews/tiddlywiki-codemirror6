// wikitext

import type { ISource } from '../types';
//  NOTE: Moving to the last field or moving the cursor out of the current field deactivates the fields.

export const usersnippets: ISource[] = [
  {
    title: 'codeblcok',
    text: '```${1:lang}\n${2:code}\n```',
    desc: ''
  },
  {
    title: 'date',
    text: `${new Date().toLocaleDateString()}`,
    desc: 'Current date'
  },
  {
    title: '$:/snippets/oeyoews/time',
    text: `${new Date().toLocaleString()}`,
    desc: 'insert current time'
  },
  {
    title: 'lorem',
    text: 'ipsum dolor s it amet, consectetur adipi sicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercita tion ullamco laboris nisi ut aliquip ex ea com modo consequat. Duis aute irure dolor in repreh enderit in voluptate velit esse cillum dolore eu fugiat nulla pari atur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    desc: 'lorem'
  },
  {
    title: 'link',
    desc: 'insert markdown link',
    text: '[#{1:link}](#{2:url})#{3}'
  }
];

// general words

export const words = ['tiddlywiki', 'GitHub', 'TiddlyWiki5'];
