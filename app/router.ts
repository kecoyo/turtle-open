import { Application } from 'egg';
import fs from 'fs-extra';
// const sse = require('koa-sse-stream');

/**
 * 获取文件内容
 */
function getItemContent(item) {
  const symbleKey = Reflect.ownKeys(item).find(key => key.toString() === 'Symbol(EGG_LOADER_ITEM_FULLPATH)');
  if (symbleKey) {
    const itemFullPath = item[symbleKey];
    const content = fs.readFileSync(itemFullPath, 'utf-8');
    return content;
  }
  return null;
}

/**
 * 获取方法的注释
 */
function getActionComment(content, actionName) {
  let result = content.match(new RegExp(`@summary.*\\n(^\\s*\\*\\s*.*\\n)*(\\s*async\\s+${actionName}\\(\\)\\s*\\{)`, 'gm'));
  if (result) {
    return result[0];
  }
  return '';
}

/**
 * 判断注释中有apikey
 */
function hasApikeyByComment(comment = '') {
  return /@apikey/gi.test(comment);
}

/**
 * 获取router中method
 */
function getMethodByComment(comment = '') {
  const result = /@[r|R]outer\s+(\w+)/g.exec(comment);
  if (result) {
    return result[1].toLowerCase();
  }
  return '';
}

export default (app: Application) => {
  const { router } = app;

  // register routes
  const registerRoutes = (items: object, path: string) => {
    for (const itemName in items) {
      if (Object.prototype.hasOwnProperty.call(items, itemName)) {
        const item = items[itemName];
        const itemContent = getItemContent(item); // 文件内容

        for (const actionName in item) {
          if (Object.prototype.hasOwnProperty.call(item, actionName)) {
            const action = item[actionName];

            if (typeof action === 'function') {
              const comment = getActionComment(itemContent, actionName); // 方法注释
              if (comment) {
                const middlewares: any[] = [];

                // 如果方法注释中有@apikey，则添加jwt中间件
                if (hasApikeyByComment(comment)) {
                  middlewares.push(app.jwt);
                }

                // 获取方法注释中路由方法
                const method = getMethodByComment(comment) || 'all';
                router[method](`${path}/${itemName}/${actionName}`, ...middlewares, action);
              }
            } else {
              // 有多级目录的，递归
              registerRoutes(item, `${path}/${itemName}`);
            }
          }
        }
      }
    }
  };

  registerRoutes(app.controller, '/api');
};
