import { Application } from 'egg';
import {
  Association,
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { UserBindModel } from './user_bind';

export class AppModel extends Model<InferAttributes<AppModel>, InferCreationAttributes<AppModel>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare wechatAppId: string;
  declare wechatAppSecret: string;
  declare remark: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare status: CreationOptional<number>;
  declare deletedAt: CreationOptional<Date>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  declare getUserBinds: HasManyGetAssociationsMixin<UserBindModel>;
  declare addUserBind: HasManyAddAssociationMixin<UserBindModel, number>;
  declare addUserBinds: HasManyAddAssociationsMixin<UserBindModel, number>;
  declare setUserBinds: HasManySetAssociationsMixin<UserBindModel, number>;
  declare removeUserBind: HasManyRemoveAssociationMixin<UserBindModel, number>;
  declare removeUserBinds: HasManyRemoveAssociationsMixin<UserBindModel, number>;
  declare hasUserBind: HasManyHasAssociationMixin<UserBindModel, number>;
  declare hasUserBinds: HasManyHasAssociationsMixin<UserBindModel, number>;
  declare countUserBinds: HasManyCountAssociationsMixin;
  declare createUserBind: HasManyCreateAssociationMixin<UserBindModel, 'appId'>;

  declare userBinds?: NonAttribute<UserBindModel[]>;

  declare static associations: {
    userBinds: Association<AppModel, UserBindModel>;
  };
}

export default function (app: Application) {
  const AppModel = app.model.define<AppModel>(
    'App',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      wechatAppId: DataTypes.STRING,
      wechatAppSecret: DataTypes.STRING,
      remark: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      status: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {
      tableName: 'system_app',
    },
  );

  app.logger.info('model App loaded');

  return class App extends AppModel {
    static async associate() {
      app.model.App.hasMany(app.model.UserBind, { as: 'userBinds', foreignKey: 'userId' });
    }
  };
}
