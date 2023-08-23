import { Service } from 'egg';

export default class AppService extends Service {
  /**
   * 获取应用配置信息
   *
   * @param {number} appId 应用ID
   */
  async getAppInfo(appId: number) {
    const { ctx } = this;

    // 获取应用配置
    let appInfo = await ctx.model.App.findByPk(appId);
    if (!appInfo) {
      throw ctx.createError(1, 'appId does not exist');
    }

    return appInfo;
  }
}
