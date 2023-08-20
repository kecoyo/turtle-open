import { Controller } from 'egg';

/**
 * @controller User 用户
 */
export default class UserController extends Controller {
  /**
   * @summary 用户名密码登录
   * @description
   * @router POST /user/login
   * @request body loginUserRequest *body
   * @response 200 loginUserResponse 登录成功，返回用户信息
   */
  async login() {
    const { ctx, service } = this;

    ctx.validate(ctx.rule.loginUserRequest);

    const { username, password } = ctx.request.body;
    const data = await service.user.login(username, password);
    ctx.success(data);
  }
}
