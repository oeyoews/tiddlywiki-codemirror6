import { getAllTiddlers } from './tiddlers';

const type = 'cm-tiddler-embed';
const section = 'tiddlers';
const delimiter = '{{';

export default {
  section,
  type,
  delimiter,
  snippets: () => getAllTiddlers(delimiter)
};
