import { Service } from 'egg';
import _ from 'lodash';

export default class UserService extends Service {
  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   * @returns
   */
  async login(username, password) {
    const { ctx, app } = this;

    const user = await ctx.model.User.findOne({
      attributes: { exclude: ['status', 'deletedAt'] },
      where: { username },
    });
    if (!user) {
      throw ctx.createError(1, '用户不存在');
    }

    let verify = await ctx.compare(password, user.password);
    if (!verify) {
      throw ctx.createError(2, '用户名或密码错误');
    }

    // 生成Token令牌
    let token = await app.jwt.sign({ id: user.id });
    return {
      ..._.omit(user.dataValues, ['password']),
      token,
    };
  }
}
