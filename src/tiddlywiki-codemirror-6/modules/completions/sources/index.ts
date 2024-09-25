import codeblocks from './codeblocks';
import commands from './commands';
import emojis from './emojis';
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
  emojis,
  filetype,
  help,
  images,
  macros,
  // markdown // 和emoji 冲突， 不常用，暂时不处理
  // 动态加载mermaidCB, 判断用户是否安装了mermaid
  mermaidCb,
  snippets,
  tags,
  tiddlersEmbed,
  tiddlers,
  tiddlersCn,
  widget,
  template
];

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
