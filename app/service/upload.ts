import { Service } from 'egg';
import fs from 'fs-extra';
import path from 'path';

export default class UploadService extends Service {
  /**
   * 上传文件到upload目录，及上传到七牛对象存储服务器
   * @param {number} appId 应用ID
   * @param {string} hash 文件hash
   */
  async getFileInfo(appId: number, hash: string) {
    const { ctx, app, config } = this;

    // 检查应用信息
    await ctx.service.app.getAppInfo(appId, true);

    // 查找文件
    let fileInfo = await ctx.model.SystemFile.findOne({
      where: { appId, hash },
    });
    if (!fileInfo) {
      throw ctx.createError(1, '文件不存在', 0);
    } else if (fileInfo.status === 1) {
      const key = fileInfo.xkey;
      const file = path.join(config.baseDir, 'app/public', key);
      const buffer = fs.readFileSync(file);
      throw ctx.createError(1, '文件不完整，需要继续上传', buffer.length); // 最后上传的位置
    }

    return { key: fileInfo.xkey, url: fileInfo.xurl };
  }

  /**
   * 上传文件到upload目录，及上传到七牛对象存储服务器
   * @param {object} payload
   */
  async uploadFile(payload: { appId: number; tags: string; file: any }, userId: number) {
    const { ctx, config, app } = this;
    const { appId, tags, file } = payload;

    // 检查应用信息
    await ctx.service.app.getAppInfo(appId, true);

    const fileName = file.filename;
    const ext = path.extname(fileName).toLowerCase().substring(1);
    const content = fs.readFileSync(file.filepath);
    const hash = ctx.helper.md5(content);
    const hashName = `${hash}.${ext}`;
    const key = path.join('upload', `${appId}`, hashName).replace(/\\/g, '/'); // 解决：windows下路径斜杠是反的
    const stat = fs.statSync(file.filepath);

    // 查找文件，看文件是否已经上传了
    let fileInfo = await ctx.model.SystemFile.findOne({
      where: { appId, hash },
    });
    if (fileInfo) {
      // 文件已经上传过，直接返回
      return { key: fileInfo.xkey, url: fileInfo.xurl };
    }

    // 上传七牛文件存储
    this.uploadFileToQiniu(key, file.filepath);

    // 创建文件记录
    fileInfo = await ctx.model.SystemFile.create({
      appId,
      hash,
      tags,
      type: 'qiniu',
      name: fileName,
      xext: ext,
      xkey: key,
      xurl: config.upload.baseUrl + key,
      mime: file.mime,
      size: stat.size,
      uuid: 0,
      unid: userId,
      status: 2,
    });

    return { key: fileInfo.xkey, url: fileInfo.xurl };
  }

  /**
   * 上传文件到upload目录，及上传到七牛对象存储服务器
   * @param {object} payload
   */
  async uploadChunk(payload: { appId: number; tags: string; hash: string; name: string; size: number; mime: string; content: string }, userId: number) {
    const { ctx, config, app } = this;
    const { appId, tags, hash, name, size, mime, content } = payload;

    // 获取应用配置, 不存在会抛出异常
    await ctx.service.app.getAppInfo(appId, true);

    // 查找文件，看文件是否已经上传了
    let fileInfo = await ctx.model.SystemFile.findOne({
      where: { appId, hash },
    });
    if (fileInfo) {
      if (fileInfo.status === 2) {
        // 文件已经上传完成，直接返回
        return { key: fileInfo.xkey, url: fileInfo.xurl };
      }

      // fileInfo.status === 1，文件未完成，正在上传中
      // 合并前面上传文件
      const filePath = path.join(config.baseDir, 'app/public', fileInfo.xkey);
      const buffer0 = fs.readFileSync(filePath);
      const buffer1 = Buffer.from(content, 'base64');
      // const totalLength = buffer0.length + buffer1.length;
      const buffer = Buffer.concat([buffer0, buffer1]);
      fs.writeFileSync(filePath, buffer);

      // 上传成功
      if (buffer.length >= fileInfo.size) {
        // 完成文件上传
        this.completeUploadChunk(fileInfo.xkey, filePath, fileInfo.id);
        // 返回文件URL
        return { key: fileInfo.xkey, url: fileInfo.xurl };
      }

      throw ctx.createError(1, '继续上传', buffer.length);
    }

    // 新文件，没有上传过
    const ext = path.extname(name).toLowerCase().substring(1);
    const hashName = `${hash}.${ext}`;
    const key = path.join('upload', `${appId}`, hashName).replace(/\\/g, '/'); // 解决：windows下路径斜杠是反的

    // 创建文件记录
    fileInfo = await ctx.model.SystemFile.create({
      appId,
      hash,
      tags,
      type: 'qiniu',
      name,
      xext: ext,
      xkey: key,
      xurl: config.upload.baseUrl + key,
      mime,
      size,
      uuid: 0,
      unid: userId,
      status: 1,
    });

    const filePath = path.join(config.baseDir, 'app/public', key);
    fs.ensureDirSync(path.dirname(filePath)); // 确保目录存在，否则为报错
    const buffer = Buffer.from(content, 'base64');
    fs.writeFileSync(filePath, buffer);

    // 小文件，上传成功
    if (buffer.length >= fileInfo.size) {
      // 完成文件上传
      this.completeUploadChunk(key, filePath, fileInfo.id);
      // 返回文件URL
      return { key: fileInfo.xkey, url: fileInfo.xurl };
    }

    throw ctx.createError(1, '继续上传', buffer.length);
  }

  // 完成文件上传
  private async completeUploadChunk(key: string, filePath: string, fileId: number) {
    const { ctx } = this;
    // 上传到七牛存储服务器
    await this.uploadFileToQiniu(key, filePath);
    // 更新数据库文件状态
    await ctx.model.SystemFile.update({ status: 2 }, { where: { id: fileId } });
    // 删除临时文件
    await this.deleteTempFile(filePath);
  }

  // 上传七牛文件存储
  private async uploadFileToQiniu(key: string, filePath: string) {
    const { ctx, app } = this;
    const ret = await app.qiniu.uploadFile(key, filePath);
    if (!ret.ok) {
      throw ctx.createError(2, 'uploadFileToQiniu error');
    }
  }

  // 删除临时文件，同时向上递归删除空的目录
  private async deleteTempFile(filePath: string) {
    // 删除文件
    fs.removeSync(filePath);
    // 获取父目录
    const dirname = path.dirname(filePath);
    // 获取当前目录下所有文件
    const files = fs.readdirSync(dirname);
    if (files.length === 0) {
      this.deleteTempFile(dirname);
    }
  }
}
