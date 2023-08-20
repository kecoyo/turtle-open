import { Application } from 'egg';

// 扩展一些框架便利的方法
export default {
  /**
   * 签发token
   * @param data data
   * @returns
   */
  async jwtSign(this: Application, data: Record<string, any>): Promise<string> {
    const { secret } = this.config.jwt;
    return this.jwt.sign(data, secret);
  },

  /**
   * 验证token
   * @param token token
   * @returns
   */
  async jwtVerify(this: Application, token: string): Promise<string> {
    const { secret } = this.config.jwt;
    return this.jwt.verify(token, secret);
  },

  // think.app
  // think.ROOT_PATH
  // think.APP_PATH
  // think.env
  // think.version
  // think.config(name, value, m)
  // think.Controller
  // think.Logic
  // think.Service
  // think.service(name, m, ...args)
  // think.beforeStartServer(fn)
  // think.isArray(array)
  // think.isBoolean(boolean)
  // think.isInt(any)
  // think.isNull(any)
  // think.isNullOrUndefined(any)
  // think.isNumber(number)
  // think.isString(str)
  // think.isSymbol(any)
  // think.isUndefined(any)
  // think.isRegExp(reg)
  // think.isDate(date)
  // think.isError(error)
  // think.isFunction(any)
  // think.isPrimitive(any)
  // think.isIP(ip)
  // think.isBuffer(buffer)
  // think.isIPv4(ip)
  // think.isIPv6(ip)
  // think.isMaster
  // think.isObject(obj)
  // think.promisify(fn, receiver)
  // think.extend(target,...any)
  // think.camelCase(str)
  // think.snakeCase(str)
  // think.isNumberString(str)
  // think.isTrueEmpty(any)
  // think.isEmpty(any)
  // think.defer()
  // think.omit(obj, props)
  // think.md5(str)
  // think.timeout(num)
  // think.escapeHtml(str)
  // think.datetime(date, format)
  // think.uuid(version)
  // think.ms(str)
  // think.isExist(path)
  // think.isFile(filepath)
  // think.isDirectory(filepath)
  // think.chmod(path, mode)
  // think.mkdir(path, mode)
  // think.getdirFiles(dir, prefix)
  // think.rmdir(path, reserve)
};
