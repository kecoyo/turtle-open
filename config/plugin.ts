import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  sequelize: {
    enable: true,
  },
  qiniu: {
    enable: true,
  },
};

export default plugin;
