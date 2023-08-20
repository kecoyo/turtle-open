import { Application, Context, EggAppConfig } from 'egg';

// 错误处理
export default (option: EggAppConfig, app: Application) => {
  return async function (ctx: Context, next: () => Promise<any>) {
    try {
      await next();
    } catch (err: any) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      // app.emit('error', err);

      if (err.name === 'HttpResponseError') {
        ctx.fail(err.code, err.message); // 自定义错误
      } else if (err.status === 422) {
        ctx.fail(err.status, err.message, err.errors); // 422，参数错误
      } else {
        // 错误状态码
        const status = err.status || 500;
        // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
        const message = status === 500 && app.config.env === 'prod' ? 'Internal Server Error' : err.message;

        // 只有 500 错误，才记录一条错误日志
        if (status === 500) {
          app.emit('error', err);
        }

        ctx.fail(status, message);
      }
    }
  };
};
