import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1h89m33ug';

  // 上传配置
  config.upload = {
    baseUrl: 'https://cdn.kecoyo.com/',
  };

  return config;
};
