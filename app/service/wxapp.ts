import { Service } from 'egg';
import _ from 'lodash';

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

    // 获取应用配置
    let appInfo = await ctx.model.App.findByPk(appId);
    if (!appInfo) {
      throw ctx.createError(1, 'appId does not exist');
    }

    // 登录凭证校验
    const url = `${jscode2sessionUri}?appid=${appInfo.wechatAppId}&secret=${appInfo.wechatAppSecret}&js_code=${code}&grant_type=authorization_code`;
    const res = await ctx.curl(url, {
      dataType: 'json',
    });
    if (res.data && res.data.errcode) {
      const { errcode, errmsg } = res.data;
      throw ctx.createError(errcode, errmsg);
    }

    // 通过openid获取用户信息
    const { openid, session_key } = res.data;
    let user;
    let userBind = await ctx.model.UserBind.findOne({ where: { appId, openid }, include: 'user' });
    if (!userBind) {
      // 没有绑定，则创建新用户
      user = await ctx.model.User.create({
        name: '用户_' + Date.now().toString(36),
      });
      userBind = await ctx.model.UserBind.create({
        appId,
        openid,
        userId: user.id,
      });
    } else {
      user = userBind.user;
    }

    // 生成Token令牌
    let token = await app.jwtSign({ id: user.id });
    return {
      ..._.pick(user.dataValues, ['id', 'name', 'avatar', 'phone', 'gender', 'birthday', 'email', 'remark']),
      token,
    };
  }
}
