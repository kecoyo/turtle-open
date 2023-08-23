import { Application, IBoot } from 'egg';

export default class AppBoot implements IBoot {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have loaded.
  }

  async didLoad() {
    // All files have loaded, start plugin here.
    // await this.app.model.sync();
    // await this.app.model.sync({ alter: true });
    // await this.app.model.sync({ force: true });

    this.app.validator.addRule('jsonString', (rule, value) => {
      try {
        JSON.parse(value);
      } catch (err) {
        return 'must be json string';
      }
    });

    this.app.validator.addRule('file', (rule, value) => {
      if (!value.filepath) {
        return 'must be file';
      }
    });
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready.
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
  }

  async serverDidReady() {
    // Server is listening.
  }

  async beforeClose() {
    // Do some thing before app close.
  }
}
