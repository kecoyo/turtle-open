import { Context, EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import path from 'path';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}';

  // add your middleware config here
  config.middleware = ['errorHandler'];

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.multipart = {
    mode: 'file',
    fileSize: '50mb',
    files: 10,
    fileExtensions: ['.apk', '.pptx', '.docx', '.csv', '.doc', '.ppt', '.pdf', '.pages', '.wav', '.mov'], // 增加对 .apk 扩展名的支持
    tmpdir: path.join(appInfo.root, 'app/public/tmp'),
    cleanSchedule: {
      // run tmpdir clean job on every day 04:30 am
      // cron style see https://github.com/eggjs/egg-schedule#cron-style-scheduling
      cron: '0 30 4 * * *',
      disable: false,
    },
  };

  config.jwt = {
    enable: true, // default is false
    secret: 'jwt-secret',
    getToken: (ctx: Context) => {
      if (ctx.headers.authorization) {
        return ctx.headers.authorization;
      } else if (ctx.query && ctx.query.token) {
        return ctx.query.token;
      }
      return null;
    },
    sign: {
      expiresIn: '3d',
    },
    // options.match and options.ignore can not both present
    match: /^\/jwt/, // 匹配的请求，会走jwt校验，否则忽略；例如登录接口需要被忽略；
  };

  config.bcrypt = {
    saltRounds: 10, // default 10
  };

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'egg-server',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    pool: {
      max: 50,
      min: 0, // 建立连接最长时间
      acquire: 30000, // 空闲最长连接时间
      idle: 10000,
    },
    dialectOptions: {
      charset: 'utf8mb4',
      decimalNumbers: true, // 默认DECIMAL and NEWDECIMAL 返回 String
    },
    define: {
      freezeTableName: true, // 使用自定义的表名
      underscored: true, // 驼峰式字段默认转为下划线
      createdAt: true, // 添加createAt
      updatedAt: true, // 添加updateAt
      deletedAt: true, // 添加deletedAt
      paranoid: true, // 启用软删除
      timestamps: true, // 添加create,update,delete时间戳
    },
    timezone: '+8:00', // 由于orm用的UTC时间，这里必须加上东八区，否则取出来的时间相差8小时
  };

  // 单数据库信息配置
  config.mysql = {
    client: {
      database: 'egg-server',
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '123456',
    },
    app: true, // 是否加载到 app 上，默认开启
    agent: false, // 是否加载到 agent 上，默认关闭
  };

  config.cors = {
    origin: '*',
    allowMethods: 'OPTIONS,GET,POST,HEAD,PUT,DELETE,PATCH',
  };

  config.swaggerdoc = {
    dirScanner: './app/controller', // 配置自动扫描的控制器路径
    apiInfo: {
      title: '接口文档', // 接口文档的标题
      description: 'swagger 测试接口文档', // 接口文档描述
      version: '1.0.0', // 接口文档版本
    },
    basePath: '/api', // 配置基础路径
    schemes: ['http', 'https'], // 配置支持的协议
    consumes: ['application/json'], // 指定处理请求的提交内容类型 (Content-Type)，如 application/json、text/html
    produces: ['application/json'], // 指定返回的内容类型，仅当 request 请求头中的(Accept)类型中包含该指定类型才返回
    securityDefinitions: {
      apikey: {
        type: 'apiKey',
        name: 'authorization',
        in: 'header',
      },
    }, // 配置接口安全授权方式
    enableSecurity: true, // 是否启用授权，默认 false
    enableValidate: true, // 是否启用参数校验，默认 true
    // routerMap: false, // 是否启用自动生成路由(实验功能)，默认 true
    enable: true, // 默认 true
  };

  // 配置参数校验器，基于parameter
  config.validate = {
    convert: true, // 对参数可以使用 convertType 规则进行类型转换
    // validateRoot: false, // 限制被验证值必须是一个对象。
  };

  // 七牛对象存储
  config.qiniu = {
    default: {
      ak: '', // Access Key
      sk: '', // Secret Key
      useCdnDomain: true,
      isLog: true,
    },
    app: true,
    agent: false,
  };

  // //////////////////////////////////////////////////////////

  // openai
  config.openai = {
    apiKey: '',
  };

  // 微信小程序
  config.wxapp = {
    appId: '',
    appSecret: '',
  };

  config.app = {
    appId: 1,
  };

  return config;
};
