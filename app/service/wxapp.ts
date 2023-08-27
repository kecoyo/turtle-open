import { Service } from 'egg';

// 微信相关接口常量
const jscode2sessionUri = 'https://api.weixin.qq.com/sns/jscode2session'; // 微信临时授权码

export default class WxappService extends Service {
  /**
   * 小程序登录
   * @param appId 用户ID
   * @param code 登录凭证
   * @returns
   */
  async mpLogin(appId: number, code: string) {
    const { ctx, config, app } = this;

    // 获取应用配置, 默认不存在会抛出异常
    let appInfo = await ctx.service.app.getAppInfo(appId, true);

    // 登录凭证校验
    const url = `${jscode2sessionUri}?appid=${appInfo?.wechatAppId}&secret=${appInfo?.wechatAppSecret}&js_code=${code}&grant_type=authorization_code`;
    const res = await ctx.curl(url, {
      dataType: 'json',
    });
    if (res.data && res.data.errcode) {
      const { errcode, errmsg } = res.data;
      throw ctx.createError(errcode, errmsg);
    }

    // 通过openid获取用户信息
    const { openid, session_key } = res.data;
    let userBind = await ctx.model.DataUserBind.findOne({ where: { appId, openid } });
    let user;
    if (!userBind) {
      // 没有绑定，则创建新用户
      user = await ctx.model.DataUser.create({
        name: '用户_' + Date.now().toString(36),
      });
      userBind = await ctx.model.DataUserBind.create({
        appId,
        openid,
        userId: user.id,
      });
    }

    user = await ctx.model.DataUser.scope('userInfo').findByPk(userBind.userId);

    // 生成Token令牌
    let token = await app.jwt.sign({ id: user.id });
    return {
      ...user.dataValues,
      token,
    };
  }
}
