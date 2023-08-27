import { Service } from 'egg';

export default class UserService extends Service {
  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   * @returns
   */
  async login(username: string, password: string) {
    const { ctx, app } = this;

    let user = await ctx.model.DataUser.findOne({
      attributes: ['id', 'password'],
      where: { username },
    });
    if (!user) {
      throw ctx.createError(1, '用户不存在');
    }

    let verify = await ctx.compare(password, user.password);
    if (!verify) {
      throw ctx.createError(2, '用户名或密码错误');
    }

    // 重新加载更多信息
    user = await ctx.model.DataUser.scope('userInfo').findByPk(user.id);

    // 生成Token令牌
    let token = await app.jwt.sign({ id: user?.id });
    return {
      ...user?.dataValues,
      token,
    };
  }
}
