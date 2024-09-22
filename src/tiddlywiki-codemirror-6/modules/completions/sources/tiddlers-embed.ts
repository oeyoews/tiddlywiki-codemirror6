import { getAllTiddlers } from './tiddlers';

const type = 'cm-tiddler';
const section = 'tiddlers';
const delimiter = '{{';

export default {
  section,
  type,
  delimiter,
  snippets: () => getAllTiddlers(delimiter)
};
