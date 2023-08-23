import { Controller } from 'egg';

/**
 * @controller Upload 上传
 */
export default class UploadController extends Controller {
  /**
   * @summary 文件上传检查
   * @description
   * @router POST /upload/state
   * @apikey
   * @request body uploadStateRequest *body
   * @response 200 uploadStateResponse 上传文件，返回文件信息
   */
  async state() {
    const { ctx, service } = this;

    ctx.validate(ctx.rule.uploadStateRequest);

    const { appId, subId, hash } = ctx.request.body;
    const data = await service.upload.state(appId, subId, hash);
    ctx.success(data);
  }

  /**
   * @summary 上传文件
   * @description
   * @router POST /upload/uploadFile
   * @apikey
   * @request formData integer *appId
   * @request formData string *subId
   * @request formData file *file
   * @response 200 uploadFileResponse 上传文件，返回文件信息
   */
  async uploadFile() {
    const { ctx, service } = this;

    const body = {
      ...ctx.request.body,
      file: ctx.request.files[0],
    };

    ctx.validate(ctx.rule.uploadFileRequest, body);

    const { appId, subId, file } = body;
    const { user } = ctx.state;
    const data = await service.upload.uploadFile({ appId, subId, file, userId: user.id });
    ctx.success(data);
  }
}
