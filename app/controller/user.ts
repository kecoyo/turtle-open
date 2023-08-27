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
    const { ctx } = this;
    const { user } = ctx.state;

    const loginUser = await ctx.model.DataUser.scope('userInfo').findByPk(user.id);
    ctx.success(loginUser);
  }

  /**
   * @summary 修改当前用户基本信息
   * @description
   * @router POST /user/updateBaseInfo
   * @apikey
   * @request body updateBaseInfoRequest *body
   * @response 200 baseResponse 修改成功
   */
  async updateBaseInfo() {
    const { ctx } = this;
    const { user } = ctx.state;

    ctx.validate(ctx.rule.updateBaseInfoRequest);

    const userInfo = ctx.request.body;
    const [affectedCount] = await ctx.model.DataUser.update(userInfo, {
      where: { id: user.id },
    });
    ctx.success(affectedCount);
  }
}
