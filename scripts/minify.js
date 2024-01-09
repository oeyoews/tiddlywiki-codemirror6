const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const currentDir = path.join(__dirname, '..', 'src/tiddlywiki-codemirror-6');

const options = {
  toplevel: true,
  compress: {
    global_defs: {
      '@console.log': 'alert'
    },
    passes: 2
  },
  format: {
    // preamble: '/* minified */'
    comments: '/title|type|module-type/'
  }
};

const jsFiles = fs
  .readdirSync(currentDir)
  .filter((file) => path.extname(file) === '.js');

jsFiles.forEach(async (file) => {
  const code = {};
  const filePath = path.join(currentDir, file);
  const originalCode = fs.readFileSync(filePath, 'utf8');
  code[file] = originalCode;
  const result = await minify(code, options);
  console.log(result.code);
});
