import { Application } from 'egg';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class SystemAppModel extends Model<InferAttributes<SystemAppModel>, InferCreationAttributes<SystemAppModel>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare wechatAppId: string;
  declare wechatAppSecret: string;
  declare createAt: CreationOptional<Date>;
  declare updateAt: CreationOptional<Date>;
}

export default function (app: Application) {
  const SystemAppModel = app.model.define<SystemAppModel>(
    'SystemApp',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      wechatAppId: DataTypes.STRING,
      wechatAppSecret: DataTypes.STRING,
      createAt: DataTypes.DATE,
      updateAt: DataTypes.DATE,
    },
    {
      tableName: 'system_app',
      createdAt: 'createAt',
      updatedAt: 'updateAt',
    },
  );

  app.logger.info('model SystemApp loaded');

  return class SystemApp extends SystemAppModel {
    static async associate() {
      app.model.SystemApp.hasMany(app.model.DataUserBind, { as: 'userBinds', foreignKey: 'userId' });
    }
  };
}
