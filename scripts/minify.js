const fs = require('fs');
const path = require('path');
const {minify} = require('terser');

const currentDir = process.cwd();

// 获取当前目录下的所有 JS 文件
const jsFiles = fs.readdirSync(currentDir)
  .filter(file => path.extname(file) === '.js');

// 循环处理每个 JS 文件
jsFiles.forEach(file => {
  const filePath = path.join(currentDir, file);
  const originalCode = fs.readFileSync(filePath, 'utf8');

  // 使用 Terser 压缩代码
  const minifiedCode = minify(originalCode).code;

  // 写入压缩后的代码
  fs.writeFileSync(filePath, minifiedCode, 'utf8');

  console.log(`已压缩文件：${file}`);
});

console.log('压缩完成！');
