import path from 'node:path';
import fs from 'node:fs';

export function mkdirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    // 判断目录是否存在
    mkdirSync(path.dirname(dirPath)); // 递归调用上一级目录
    fs.mkdirSync(dirPath); // 创建当前目录
  }
}
