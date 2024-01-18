import delimiter from '../../utils/triggerType';
import { imageSnippets } from './images';
import { userSnippets } from './snippets';
import { widgetSnippets } from './widget';
import { getAllTiddlers } from './tiddlers';
import { macroSnippets } from './macros';
import { wordsSnippets } from './words';
import { emojiSnippets } from './emojis';
import { tagSnippets } from './tags';

export default {
  imageSnippets,
  userSnippets,
  widgetSnippets,
  linkSnippets: getAllTiddlers,
  macroSnippets,
  embedSnippets: () => getAllTiddlers(delimiter.embed),
  wordsSnippets,
  emojiSnippets,
  tagSnippets
};
