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
import { AppModel } from './app';
import { UserModel } from './user';

export class UserBindModel extends Model<InferAttributes<UserBindModel>, InferCreationAttributes<UserBindModel>> {
  declare id: CreationOptional<number>;
  declare appId: number;
  declare userId: number;
  declare openid: string;
  declare unionid: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare status: CreationOptional<number>;
  declare deletedAt: CreationOptional<Date>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  declare getApp: BelongsToGetAssociationMixin<AppModel>;
  declare createApp: BelongsToCreateAssociationMixin<AppModel>;
  declare setApp: BelongsToSetAssociationMixin<AppModel, number>;

  declare app?: NonAttribute<CreationOptional<AppModel>>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  declare getUser: BelongsToGetAssociationMixin<UserModel>;
  declare createUser: BelongsToCreateAssociationMixin<UserModel>;
  declare setUser: BelongsToSetAssociationMixin<UserModel, number>;

  declare user?: NonAttribute<UserModel>;

  declare static associations: {
    user: Association<UserBindModel, UserModel>;
  };
}

export default function (app: Application) {
  const UserBindModel = app.model.define<UserBindModel>(
    'UserBind',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      appId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      openid: DataTypes.STRING,
      unionid: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      status: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {
      tableName: 'turtle_user_bind',
    },
  );

  app.logger.info('model UserBind loaded');

  return class UserBind extends UserBindModel {
    static async associate() {
      app.model.UserBind.belongsTo(app.model.App, { as: 'app', foreignKey: 'appId' });
      app.model.UserBind.belongsTo(app.model.User, { as: 'user', foreignKey: 'userId' });
    }
  };
}
