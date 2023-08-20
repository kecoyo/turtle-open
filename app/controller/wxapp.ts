import { Controller } from 'egg';

/**
 * @controller Wxapp 微信
 */
export default class WxappController extends Controller {
  /**
   * @summary 小程序登录
   * @description
   * @router POST /wxapp/mpLogin
   * @request body mpLoginWxappRequest *body
   * @response 200 mpLoginWxappResponse 登录成功，返回用户信息
   */
  async mpLogin() {
    const { ctx, service } = this;

    ctx.validate(ctx.rule.mpLoginWxappRequest);

    const { appId, code } = ctx.request.body;
    const data = await service.wxapp.mpLogin(appId, code);
    ctx.success(data);
  }
}
