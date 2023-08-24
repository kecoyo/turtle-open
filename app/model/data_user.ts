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
import { DataUserBindModel } from './data_user_bind';

export class DataUserModel extends Model<InferAttributes<DataUserModel>, InferCreationAttributes<DataUserModel>> {
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
  declare createAt: CreationOptional<Date>;
  declare updateAt: CreationOptional<Date>;
  declare status: CreationOptional<number>;
  declare deletedAt: CreationOptional<Date>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  declare getUserBinds: HasManyGetAssociationsMixin<DataUserBindModel>;
  declare addUserBind: HasManyAddAssociationMixin<DataUserBindModel, number>;
  declare addUserBinds: HasManyAddAssociationsMixin<DataUserBindModel, number>;
  declare setUserBinds: HasManySetAssociationsMixin<DataUserBindModel, number>;
  declare removeUserBind: HasManyRemoveAssociationMixin<DataUserBindModel, number>;
  declare removeUserBinds: HasManyRemoveAssociationsMixin<DataUserBindModel, number>;
  declare hasUserBind: HasManyHasAssociationMixin<DataUserBindModel, number>;
  declare hasUserBinds: HasManyHasAssociationsMixin<DataUserBindModel, number>;
  declare countUserBinds: HasManyCountAssociationsMixin;
  declare createUserBind: HasManyCreateAssociationMixin<DataUserBindModel, 'userId'>;

  declare userBinds?: NonAttribute<DataUserBindModel[]>;

  declare static associations: {
    userBinds: Association<DataUserModel, DataUserBindModel>;
  };
}

export default function (app: Application) {
  const DataUserModel = app.model.define<DataUserModel>(
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
      createAt: DataTypes.DATE,
      updateAt: DataTypes.DATE,
      status: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {
      tableName: 'data_user',
    },
  );

  app.logger.info('model User loaded');

  return class DataUser extends DataUserModel {
    static async associate() {
      app.model.DataUser.hasMany(app.model.DataUserBind, { as: 'userBinds', foreignKey: 'userId' });
    }
  };
}
