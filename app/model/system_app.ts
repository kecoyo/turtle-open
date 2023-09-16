import { Application } from 'egg';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class SystemAppModel extends Model<InferAttributes<SystemAppModel>, InferCreationAttributes<SystemAppModel>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare wechatAppId: string;
  declare wechatAppSecret: string;
  declare remark: string;
  declare createAt: CreationOptional<Date>;
  declare updateAt: CreationOptional<Date>;
  declare status: CreationOptional<number>;
  declare deleted: CreationOptional<number>;
}

export default function (app: Application) {
  const SystemAppModel = app.model.define<SystemAppModel>(
    'SystemApp',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      wechatAppId: DataTypes.STRING,
      wechatAppSecret: DataTypes.STRING,
      remark: DataTypes.STRING,
      createAt: DataTypes.DATE,
      updateAt: DataTypes.DATE,
      status: DataTypes.TINYINT,
      deleted: DataTypes.TINYINT,
    },
    {
      tableName: 'system_app',
      createdAt: 'createAt',
      updatedAt: 'updateAt',
      defaultScope: {
        where: { deleted: 0, status: 1 },
      },
    },
  );

  app.logger.info('model SystemApp loaded');

  return class SystemApp extends SystemAppModel {};
}
