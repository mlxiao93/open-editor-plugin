import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { IncomingMessage } from 'node:http';
import type { Compiler } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { HtmlTagObject } from 'html-webpack-plugin';
import type Server from 'webpack-dev-server';
// @ts-ignore
import launchEditor from 'launch-editor';
import { dynamicImport } from './helper';

export default class OpenEditorPlugin {
  static loader: string;

  apply(compiler: Compiler) {
    compiler.hooks.afterResolvers.tap('OpenEditorPlugin', () => {
      // 添加devServer路由中间件接收打开编辑器的请求
      const { devServer } = compiler.options;
      if (!devServer) return;
      const originSetupMiddlewares = devServer.setupMiddlewares;
      devServer.setupMiddlewares = function (
        middlewares: Server.Middleware[],
        server: Server
      ) {
        const app = server?.app;
        if (!app) return;
        app.get(
          '/oep-open-editor',
          async (req: Server.Request, res: Server.Response) => {
            const { pathname, line } = req.query as Record<string, any>;

            launchEditor(
              `${pathname}:${line}`,
              'code',
              (_fileName: string, errorMsg: string) => {
                console.warn(errorMsg);
              }
            );
            res.send('ok');
          }
        );

        const originMiddlewares =
          originSetupMiddlewares?.(middlewares, server) || [];

        return [...originMiddlewares, ...middlewares];
      };
    });

    compiler.hooks.compilation.tap('OpenEditorPlugin', compilation => {
      // 插入脚本：监听点击事件，发送打开编辑器的http请求
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        'OpenEditorPlugin',
        (data, cb) => {
          const jsCode = readFileSync(
            resolve(__dirname, './inject/click-listener.js'),
            { encoding: 'utf-8' }
          );
          const scriptTag: HtmlTagObject = {
            tagName: 'script',
            voidTag: false,
            innerHTML: jsCode,
            attributes: {},
            meta: {},
          };

          data.bodyTags.push(scriptTag);
          cb(null, data);
        }
      );
    });
  }
}
