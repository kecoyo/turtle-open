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

export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  declare id: CreationOptional<number>;
  declare username: CreationOptional<string>;
  declare password: CreationOptional<string>;
  declare name: string;
  declare avatar: CreationOptional<string>;
  declare phone: CreationOptional<string>;
  declare gender: CreationOptional<string>;
  declare birthday: CreationOptional<string>;
  declare email: CreationOptional<string>;
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
  declare createUserBind: HasManyCreateAssociationMixin<UserBindModel, 'userId'>;

  declare userBinds?: NonAttribute<UserBindModel[]>;

  declare static associations: {
    userBinds: Association<UserModel, UserBindModel>;
  };
}

export default function (app: Application) {
  const UserModel = app.model.define<UserModel>(
    'User',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      phone: DataTypes.STRING,
      gender: DataTypes.INTEGER,
      birthday: DataTypes.DATE,
      email: DataTypes.STRING,
      remark: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      status: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {
      tableName: 'turtle_user',
    },
  );

  app.logger.info('model User loaded');

  return class User extends UserModel {
    static async associate() {
      app.model.User.hasMany(app.model.UserBind, { as: 'userBinds', foreignKey: 'userId' });
    }
  };
}
