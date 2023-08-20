import { Controller } from 'egg';

/**
 * @controller Test 测试
 */
export default class TestController extends Controller {
  /**
   * @summary 测试Token
   * @description
   * @router POST /test/token
   * @apikey
   * @response 200 baseResponse 登录成功，返回用户信息
   */
  async token() {
    const { ctx, service } = this;

    const { user } = ctx.state;
    const loginUser = await ctx.model.User.findByPk(user.id, {
      include: ['userBinds'],
    });
    ctx.success(loginUser);
  }
}
