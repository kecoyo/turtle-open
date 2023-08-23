import { Service } from 'egg';
import fs from 'fs-extra';
import path from 'path';

export default class UploadService extends Service {
  /**
   * 上传文件到upload目录，及上传到七牛对象存储服务器
   * @param {number} appId 应用ID
   * @param {string} subId 内部ID（二级目录）
   * @param {string} hash 文件hash
   */
  async state(appId: number, subId: string, hash: string) {
    const { ctx, app, config } = this;

    // 获取应用配置
    let appInfo = await ctx.model.App.findByPk(appId);
    if (!appInfo) {
      throw ctx.createError(1, 'appId does not exist');
    }

    // 查找文件
    let file = await ctx.model.SystemFile.findOne({
      where: { appId, subId, hash },
    });
    if (!file) {
      throw ctx.createError(1, 'file does not exist');
    }

    return {
      key: file.xkey,
      url: file.xurl,
    };
  }

  /**
   * 上传文件到upload目录，及上传到七牛对象存储服务器
   * @param {object} data
   */
  async uploadFile(data: { appId: number; subId: string; file: any; userId: number }) {
    const { ctx, config, app } = this;
    const { userId, appId, subId, file } = data;

    // 获取应用配置
    let appInfo = await ctx.model.App.findByPk(appId);
    if (!appInfo) {
      throw ctx.createError(1, 'appId does not exist');
    }

    const fileName = file.filename;
    const extName = path.extname(fileName).toLowerCase();
    const ext = extName.substring(1);
    const content = fs.readFileSync(file.filepath);
    const hash = ctx.helper.md5(content);
    const newFileName = hash + extName;
    const newFilePath = path.join('upload', String(appInfo.id || 0), subId, newFileName);
    const stat = fs.statSync(file.filepath);

    // 查找文件，看文件是否已经上传了
    let fileInfo = await ctx.model.SystemFile.findOne({
      where: { appId, subId, hash },
    });
    if (fileInfo) {
      return { key: fileInfo.xkey, url: fileInfo.xurl };
    }

    // 解决：windows下路径斜杠是反的
    const key = newFilePath.replace(/\\/g, '/');

    // 上传七牛文件存储
    const ret = await app.qiniu.uploadFile(key, file.filepath);
    if (!ret.ok) {
      throw ctx.createError(1, ret.err.message);
    }

    // 创建文件记录
    fileInfo = await ctx.model.SystemFile.create({
      appId,
      subId,
      hash,
      type: 'qiniu',
      name: fileName,
      xext: ext,
      xkey: key,
      xurl: config.upload.basePath + key,
      mime: file.mime,
      size: stat.size,
      uuid: 0,
      unid: userId,
      status: 2,
    });

    return { key: fileInfo.xkey, url: fileInfo.xurl };
  }
}
