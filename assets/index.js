#!/usr/bin/env node

import fsExtra from "fs-extra";
import path from "path";
import * as url from 'url';

// const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// console.log('test');
// console.log(process.argv);

const relativeTarget = process.argv.at(-1)

const targetPath = path.resolve(process.cwd(), relativeTarget);
const srcPath = path.resolve(__dirname, 'dist');

console.log('[assets] Copying...');
fsExtra.copy(srcPath, targetPath)
