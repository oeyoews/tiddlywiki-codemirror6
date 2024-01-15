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

// default is en
let multidcontentEn = 'title: $:/language/codemirror6/\n\n';
// zh
let multidcontentZH = 'title: $:/language/codemirror6/zh/\n\n';

tiddlersInfo.forEach(([title, fields]) => {
  // TODO: update caption
  let { caption, icon, description, template, text = 'no' } = fields;

  const captionEn =
    icon + ' ' + caption.en.replace(/^\w/, (match) => match.toUpperCase());
  const captionZh = icon + ' ' + caption.zh;

  if (text === 'no' || text == 'yes') {
    template = 'input-switch';
  } else {
    template = 'input';
  }

  multidcontentEn += `${title}/caption: ${captionEn}\n${title}/description: ${description.en}\n`;
  multidcontentZH += `${title}/caption: ${captionZh}\n${title}/description: ${description.zh}\n`;

  const content = `title: ${configBaseTitle}${title}
caption: {{$:/language/codemirror6/${title}/caption}}
caption-zh: {{$:/language/codemirror6/zh/${title}/caption}}
description: {{$:/language/codemirror6/${title}/description}}
description-zh: {{$:/language/codemirror6/zh/${title}/description}}
settings-template: ${templatePrefix}${template}

${text}`;

  const filepath = path.join(dir, title + '.tid');
  fs.writeFileSync(filepath, content);
});

fs.writeFileSync(path.join(dir, 'config-en.multids'), multidcontentEn);
fs.writeFileSync(path.join(dir, 'config-zh.multids'), multidcontentZH);

console.log('tiddlywiki codemirror6 插件 配置更新完成 !!!');
