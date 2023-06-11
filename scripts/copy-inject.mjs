import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import minimist from 'minimist';
import chokidar from 'chokidar';
import { mkdirSync } from './helper.mjs';

const args = minimist(process.argv.slice(2));
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shouldWatch = args.watch;

// 待拷贝的源目录和目标目录
const src = path.resolve(__dirname, 'src/inject');
const dist = path.resolve(__dirname, 'dist/inject');

// 检查并创建目标目录
mkdirSync(dist);

function copyFiles(srcDir = src, distDir = dist) {
  // 遍历源目录
  fs.readdir(srcDir, (err, files) => {
    if (err) throw err;
    // 遍历每个文件
    files.forEach(file => {
      const srcFile = path.join(srcDir, file);
      const distFile = path.join(distDir, file);
      // 判断是否是目录，是目录则递归拷贝
      fs.stat(srcFile, (err, stats) => {
        if (err) throw err;
        if (stats.isDirectory()) {
          fs.mkdir(distFile, { recursive: true }, err => {
            if (err) throw err;
            copyFiles(srcFile, distFile);
          });
        } else {
          fs.copyFile(srcFile, distFile, err => {
            if (err) throw err;
          });
        }
      });
    });
  });
}

if (shouldWatch) {
  const watcher = chokidar.watch(srcDir, {
    ignored: /(^|[\/\\])\../, // 忽略 . 开头的文件和目录
    persistent: true, // 是否持续监听
  });
  watcher.on('change', () => {
    copyFiles();
  });
} else {
  copyFiles();
}
