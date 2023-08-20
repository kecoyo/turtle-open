import { Context } from 'egg';
import path from 'path';
import { HttpResponseError } from '../utils/errors';

// 扩展一些框架便利的方法
export default {
  //
  ROOT_PATH: path.join('.'),
  //
  WWW_PATH: path.join('.', 'app/public'),

  isAjax(this: Context) {
    return this.get('X-Requested-With') === 'XMLHttpRequest';
  },

  // 接口成功返回
  success(this: Context, data?: any, msg?: string) {
    this.body = {
      code: 0,
      msg: msg || '请求成功',
      data: data || null,
    };
  },

  // 接口失败返回
  fail(this: Context, code: number, msg?: string, data?: any) {
    this.body = {
      code,
      msg: msg || 'error',
      data,
    };
  },

  /**
   * 创建一个错误
   * @param code 错误码
   * @param message 错误信息
   * @returns
   */
  createError(code: number, message: string) {
    return new HttpResponseError(code, message);
  },
};
