const fs = require('fs');
const path = require('path');
const jsonInfo = require('../package.json');
const langtwInfo = require('../packages/lang-tiddlywiki/package.json');

const infoFilePath = path.join(
  __dirname,
  '..',
  'src/tiddlywiki-codemirror-6/plugin.info'
);

// 读取文件内容
const infoFileContent = fs.readFileSync(infoFilePath, 'utf8');

// 将 JSON 字符串转换成对象
const info = JSON.parse(infoFileContent);

// 递增版本号的末尾数字
const currentVersion = info.version.split('.').map(Number); // 将版本号字符串转换为数字数组
currentVersion[2] += 1; // 递增末尾数字

// 更新对象中的版本号
info.version = currentVersion.join('.');
jsonInfo.version = info.version;
langtwInfo.version = info.version;

// 将更新后的对象转换回 JSON 字符串
const updatedInfoFileContent = JSON.stringify(info, null, 2);

// 将更新后的内容写回文件
fs.writeFileSync(infoFilePath, updatedInfoFileContent, 'utf8');
fs.writeFileSync('./package.json', JSON.stringify(jsonInfo, null, 2), 'utf8');
fs.writeFileSync(
  './packages/lang-tiddlywiki/package.json',
  JSON.stringify(langtwInfo, null, 2),
  'utf8'
);

console.log('版本号已更新！', info.version);
