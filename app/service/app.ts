import { Service } from 'egg';

export default class AppService extends Service {
  /**
   * 获取应用配置信息
   *
   * @param {number} appId 应用ID
   * @param {boolean} throwError 没找到抛出异常
   * @returns {Object} 返回应用信息
   */
  async getAppInfo(appId: number, throwError?: boolean) {
    const { ctx } = this;

    // 获取应用配置
    let appInfo = await ctx.model.SystemApp.findByPk(appId);
    if (!appInfo && throwError) {
      throw ctx.createError(404, 'appId does not exist');
    }

    return appInfo;
  }
}
