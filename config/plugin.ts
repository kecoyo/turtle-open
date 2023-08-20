import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  static: {
    enable: true,
  },

  cors: {
    enable: true,
    package: 'egg-cors',
  },

  validate: {
    enable: true,
    package: 'egg-validate',
  },

  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },

  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },

  mysql: {
    enable: true,
    package: 'egg-mysql',
  },

  bcrypt: {
    enable: true,
    package: 'egg-bcrypt',
  },

  jwt: {
    enable: true,
    package: '@kecoyo/egg-jwt',
  },

  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },

  swaggerdoc: {
    enable: true,
    package: 'egg-swagger-doc',
  },

  qiniu: {
    enable: true,
    package: '@kecoyo/egg-qiniu',
  },
};

export default plugin;
