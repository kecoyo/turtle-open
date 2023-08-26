import { Service } from 'egg';
import fs from 'fs-extra';
import path from 'path';

interface FileChunk {
  appId: number;
  tags: string;
  hash: string;
  name: string;
  size: number;
  mime: string;
  start: number;
  length: number;
  content: string;
}

export default class UploadService extends Service {
  /**
   * 上传文件到upload目录，及上传到七牛对象存储服务器
   * @param {number} appId 应用ID
   * @param {string} hash 文件hash
   */
  async queryFile(appId: number, hash: string) {
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

    return { url: fileInfo.xkey };
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
      return { url: fileInfo.xkey };
    }

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
      status: 1,
    });

    // 完成文件上传
    await this.completeFileUpload(key, file.filepath, fileInfo.id);

    // 返回文件URL
    return { url: fileInfo.xkey };
  }

  /**
   * 上传文件到upload目录，及上传到七牛对象存储服务器
   * @param {FileChunk} fileChunk
   */
  async uploadFileChunk(fileChunk: FileChunk, userId: number) {
    const { ctx, config, app } = this;
    const { appId, tags, hash, name, size, mime, start, length, content } = fileChunk;

    // 获取应用配置, 不存在会抛出异常
    await ctx.service.app.getAppInfo(appId, true);

    // 查找文件，看文件是否已经上传了
    let fileInfo = await ctx.model.SystemFile.findOne({
      where: { appId, hash },
    });
    if (fileInfo) {
      // 文件已经上传完成，直接返回
      if (fileInfo.status === 2) {
        return { url: fileInfo.xkey };
      }

      // fileInfo.status === 1，文件未完成，正在上传中
      // 合并前面上传文件
      const filePath = path.join(config.baseDir, 'app/public', fileInfo.xkey);
      const buffer0 = fs.readFileSync(filePath);
      const buffer1 = Buffer.from(content, 'base64');
      // 简单文件的校验
      if (buffer0.length !== start || buffer1.length !== length) {
        await this.cleanAndThrowError(fileInfo.xkey, filePath, fileInfo.id);
      }
      const buffer = Buffer.concat([buffer0, buffer1]);

      return await this.writeAndCheckFileUpload(filePath, buffer, fileInfo);
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

    return await this.writeAndCheckFileUpload(filePath, buffer, fileInfo);
  }

  // 写入文件，并检查上传进度
  private async writeAndCheckFileUpload(filePath, buffer, fileInfo) {
    const { ctx } = this;

    // 写入文件
    fs.writeFileSync(filePath, buffer);

    if (buffer.length === fileInfo.size) {
      // 完成文件上传
      await this.completeFileUpload(fileInfo.xkey, filePath, fileInfo.id);
      // 返回文件URL
      return { url: fileInfo.xkey };
    } else if (buffer.length < fileInfo.size) {
      // 未上传完成，继续上传
      throw ctx.createError(1, '继续上传', buffer.length);
    } else {
      // 大小有问题，重新上传
      await this.cleanAndThrowError(fileInfo.xkey, filePath, fileInfo.id);
    }
  }

  // 完成文件上传
  private async completeFileUpload(key: string, filePath: string, fileId: number) {
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
    if (!fs.existsSync(filePath)) return;

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

  // 删除临时文件，同时向上递归删除空的目录
  private async cleanAndThrowError(key, filePath, fileId) {
    const { ctx, app } = this;

    // 删除七牛存储对象
    await app.qiniu.delete(key);

    // 删除数据库文件记录
    await ctx.model.SystemFile.destroy({ where: { id: fileId } });

    // 删除临时文件
    await this.deleteTempFile(filePath);

    // 抛出错误
    throw ctx.createError(2, '上传失败，请重新上传');
  }
}
