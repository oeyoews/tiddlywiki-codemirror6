import { IConfigFields } from '../src/tiddlywiki-codemirror-6/types';
import { configBaseTitle, tiddlers } from '../src/tiddlywiki-codemirror-6/cm6';
import fs from 'fs';
import path from 'path';

const templatePrefix =
  '$:/plugins/oeyoews/tiddlywiki-codemirror-6/ui/templates/settings/';

const tiddlersInfo = Object.entries(tiddlers) as unknown as Array<
  [string, IConfigFields]
>;

const dir = path.join('src', 'tiddlywiki-codemirror-6', 'config');

fs.rmdirSync(dir, { recursive: true });
fs.mkdirSync(dir, { recursive: true });

let multidcontent = 'title: $:/language/codemirror6/\n\n';

tiddlersInfo.forEach(([title, fields]) => {
  // TODO: update caption
  let { caption, description = caption, template, text = 'no' } = fields;

  caption = caption.replace(/^\w/, (match) => match.toUpperCase());

  if (text === 'no' || text == 'yes') {
    template = 'input-switch';
  } else {
    template = 'input';
  }

  multidcontent += `${title}/caption: ${caption}\n${title}/description: ${description}\n`;

  const content = `title: ${configBaseTitle}${title}
caption: {{$:/language/codemirror6/${title}/caption}}
description: {{$:/language/codemirror6/${title}/description}}
settings-template: ${templatePrefix}${template}

${text}`;

  const filepath = path.join(dir, title + '.tid');
  fs.writeFileSync(filepath, content);
});

fs.writeFileSync(path.join(dir, 'config.multids'), multidcontent);

console.log('配置更新完成');
