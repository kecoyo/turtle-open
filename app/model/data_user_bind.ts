import { Application } from 'egg';
import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { DataUserModel } from './data_user';
import { SystemAppModel } from './system_app';

export class DataUserBindModel extends Model<InferAttributes<DataUserBindModel>, InferCreationAttributes<DataUserBindModel>> {
  declare id: CreationOptional<number>;
  declare appId: number;
  declare userId: number;
  declare openid: string;
  declare unionid: CreationOptional<string>;
  declare createAt: CreationOptional<Date>;
  declare updateAt: CreationOptional<Date>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  declare getApp: BelongsToGetAssociationMixin<SystemAppModel>;
  declare createApp: BelongsToCreateAssociationMixin<SystemAppModel>;
  declare setApp: BelongsToSetAssociationMixin<SystemAppModel, number>;

  declare app?: NonAttribute<CreationOptional<SystemAppModel>>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  declare getUser: BelongsToGetAssociationMixin<DataUserModel>;
  declare createUser: BelongsToCreateAssociationMixin<DataUserModel>;
  declare setUser: BelongsToSetAssociationMixin<DataUserModel, number>;

  declare user?: NonAttribute<DataUserModel>;

  declare static associations: {
    user: Association<DataUserBindModel, DataUserModel>;
  };
}

export default function (app: Application) {
  const DataUserBindModel = app.model.define<DataUserBindModel>(
    'DataUserBind',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      appId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      openid: DataTypes.STRING,
      unionid: DataTypes.STRING,
      createAt: DataTypes.DATE,
      updateAt: DataTypes.DATE,
    },
    {
      tableName: 'data_user_bind',
    },
  );

  app.logger.info('model UserBind loaded');

  return class UserBind extends DataUserBindModel {
    static async associate() {
      app.model.DataUserBind.belongsTo(app.model.SystemApp, { as: 'app', foreignKey: 'appId' });
      app.model.DataUserBind.belongsTo(app.model.DataUser, { as: 'user', foreignKey: 'userId' });
    }
  };
}
