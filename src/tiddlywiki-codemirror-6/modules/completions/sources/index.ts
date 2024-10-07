import cm6 from '@/cm6/config';
import codeblocks from './codeblocks';
import commands from './commands';
import emojis from './emojis';
import fields from './fields';
import filetype from './filetype';
import help from './help';
import images from './images';
import macros from './macros';
import mermaidCb from './mermaid-cb';
import snippets from './snippets';
import tags from './tags';
import template from './template';
import tiddlers from './tiddlers';
import tiddlersCn from './tiddlers-cn';
import tiddlersEmbed from './tiddlers-embed';
import widget from './widget';
// import markdown from './markdown';
export { default as defaultSnippets } from './words';

const sources = [
  codeblocks,
  commands,
  // emojis,
  filetype,
  help,
  images,
  macros,
  // markdown // 和emoji 冲突， 不常用，暂时不处理
  // 动态加载mermaidCB, 判断用户是否安装了mermaid
  // mermaidCb,
  snippets,
  tags,
  tiddlersEmbed,
  tiddlers,
  // tiddlersCn,
  widget,
  fields,
  template
];

const snippetModules = $tw.modules.types['emoji-snippets'];
const hasMermaid = Object.keys($tw.modules.types['widget-subclass']).includes(
  '$:/plugins/oeyoews/mermaid/codeblock_sub.js'
);

if (hasMermaid) {
  sources.push(mermaidCb);
}
if (snippetModules) {
  sources.push(emojis);
}

if (cm6.chineseEmbed()) {
  sources.push(tiddlersCn);
}

export const delimiters = sources.map((item) => item.delimiter);
export const delimitersInfo = sources.map((item) => ({
  section: item.section,
  delimiters: item.delimiter,
  type: item.type,
  description: item.description || ''
}));

// 根据分隔符获取对应的source
export const getSnippets = (delimiter: string) => {
  const test = sources.find((item) => delimiter.startsWith(item.delimiter));
  // console.log(delimiter, test);
  return sources.find((item) => delimiter.startsWith(item.delimiter));
};
