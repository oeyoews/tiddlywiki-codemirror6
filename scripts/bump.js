const fs = require('fs');
const path = require('path');
const jsonInfo = require('../package.json');
const langtwInfo = require('../packages/lang-tiddlywiki/package.json');

// 版本类型，可以是 'major'，'minor' 或 'patch'
const versionType = process.argv[2] || 'patch'; // 从命令行参数中获取版本类型，默认为 'patch'

const infoFilePath = path.join(
  __dirname,
  '..',
  'src/tiddlywiki-codemirror-6/plugin.info'
);

// 读取文件内容
const infoFileContent = fs.readFileSync(infoFilePath, 'utf8');

// 将 JSON 字符串转换成对象
const info = JSON.parse(infoFileContent);

// 递增版本号的相应部分
const currentVersion = info.version.split('.').map(Number); // 将版本号字符串转换为数字数组

if (versionType === 'major') {
  currentVersion[0] += 1;
  currentVersion[1] = 0;
  currentVersion[2] = 0;
} else if (versionType === 'minor') {
  currentVersion[1] += 1;
  currentVersion[2] = 0;
} else if (versionType === 'patch') {
  currentVersion[2] += 1;
} else {
  console.error('无效的版本类型，必须是 "major"、"minor" 或 "patch"。');
  process.exit(1); // 退出进程
}

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
