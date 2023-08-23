import { Application } from 'egg';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class SystemFileModel extends Model<InferAttributes<SystemFileModel>, InferCreationAttributes<SystemFileModel>> {
  declare id: CreationOptional<number>;
  declare appId: number;
  declare subId: string;
  declare type: string;
  declare hash: string;
  declare tags: CreationOptional<string>;
  declare name: string;
  declare xext: string;
  declare xurl: string;
  declare xkey: string;
  declare mime: string;
  declare size: number;
  declare uuid: number;
  declare unid: number;
  declare isfast: CreationOptional<number>;
  declare issafe: CreationOptional<number>;
  declare status: number;
}

export default function (app: Application) {
  const SystemFileModel = app.model.define<SystemFileModel>(
    'SystemFile',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      appId: DataTypes.INTEGER,
      subId: DataTypes.STRING,
      type: DataTypes.STRING,
      hash: DataTypes.STRING,
      tags: DataTypes.STRING,
      name: DataTypes.STRING,
      xext: DataTypes.STRING,
      xurl: DataTypes.STRING,
      xkey: DataTypes.STRING,
      mime: DataTypes.STRING,
      size: DataTypes.INTEGER,
      uuid: DataTypes.INTEGER,
      unid: DataTypes.INTEGER,
      isfast: DataTypes.INTEGER,
      issafe: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      tableName: 'system_file',
      createdAt: 'create_at',
      updatedAt: 'update_at',
      deletedAt: false,
      paranoid: false, // 启用软删除
    },
  );

  app.logger.info('model SystemFile loaded');

  return class SystemFile extends SystemFileModel {
    static async associate() {
      // app.model.SystemFile.hasMany(app.model.UserBind, { as: 'userBinds', foreignKey: 'userId' });
    }
  };
}
