import { Controller } from 'egg';

/**
 * @controller Upload 上传
 */
export default class UploadController extends Controller {
  /**
   * @summary 检查上传文件的状态
   * @description
   * @router POST /upload/queryFile
   * @apikey
   * @request body queryFileRequest *body
   * @response 200 queryFileResponse 上传文件，返回文件信息
   */
  async queryFile() {
    const { ctx, service } = this;

    ctx.validate(ctx.rule.queryFileRequest);

    const { appId, hash } = ctx.request.body;
    const data = await service.upload.getFileInfo(appId, hash);
    ctx.success(data);
  }

  /**
   * @summary FormData方式上传文件
   * @description
   * @router POST /upload/uploadFile
   * @apikey
   * @request formData integer *appId
   * @request formData string *tags
   * @request formData file *file
   * @response 200 uploadFileResponse 上传文件，返回文件信息
   */
  async uploadFile() {
    const { ctx, service } = this;
    const { user } = ctx.state;

    const body = {
      ...ctx.request.body,
      file: ctx.request.files[0],
    };

    ctx.validate(ctx.rule.uploadFileRequest, body);

    const { appId, tags, file } = body;
    const data = await service.upload.uploadFile({ appId, tags, file }, user.id);
    ctx.success(data);
  }

  /**
   * @summary 大文件分片上传，支持断点续传
   * @description
   * @router POST /upload/uploadChunk
   * @apikey
   * @request body uploadChunkRequest *body
   * @response 200 uploadChunkResponse 上传文件，返回文件信息
   */
  async uploadChunk() {
    const { ctx, service } = this;
    const { user } = ctx.state;

    ctx.validate(ctx.rule.uploadChunkRequest);

    const payload = ctx.request.body;
    const data = await service.upload.uploadChunk(payload, user.id);
    ctx.success(data);
  }
}
