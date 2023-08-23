import { Controller } from 'egg';

/**
 * @controller User 用户
 */
export default class UserController extends Controller {
  /**
   * @summary 用户名密码登录
   * @description
   * @router POST /user/login
   * @request body userLoginRequest *body
   * @response 200 userLoginResponse 登录成功，返回用户信息
   */
  async login() {
    const { ctx, service } = this;

    ctx.validate(ctx.rule.userLoginRequest);

    const { username, password } = ctx.request.body;
    const data = await service.user.login(username, password);
    ctx.success(data);
  }

  /**
   * @summary 获取当前登录用户
   * @description
   * @router GET /user/getLoginUser
   * @apikey
   * @response 200 getLoginUserResponse 登录成功，返回用户信息
   */
  async getLoginUser() {
    const { ctx, service } = this;

    const { user } = ctx.state;
    const loginUser = await ctx.model.User.findByPk(user.id, {
      attributes: ['id', 'username', 'password', 'name', 'avatar', 'phone', 'gender', 'birthday', 'email', 'remark'],
    });
    ctx.success(loginUser);
  }
}
