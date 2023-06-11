import { resolve } from 'node:path';
import OpenEditorPlugin from './plugin';

const openEditorLoader = resolve(__dirname, './loader');

OpenEditorPlugin.loader = openEditorLoader;

export = OpenEditorPlugin;
