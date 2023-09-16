import { Application } from 'egg';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

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
  declare province: CreationOptional<number>;
  declare city: CreationOptional<number>;
  declare county: CreationOptional<number>;
  declare remark: CreationOptional<string>;
  declare createAt: CreationOptional<Date>;
  declare updateAt: CreationOptional<Date>;
  declare status: CreationOptional<number>;
  declare deleted: CreationOptional<number>;
}

export default function (app: Application) {
  const DataUserModel = app.model.define<DataUserModel>(
    'DataUser',
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
      province: DataTypes.INTEGER,
      city: DataTypes.INTEGER,
      county: DataTypes.INTEGER,
      remark: DataTypes.STRING,
      createAt: DataTypes.DATE,
      updateAt: DataTypes.DATE,
      status: DataTypes.TINYINT,
      deleted: DataTypes.TINYINT,
    },
    {
      tableName: 'data_user',
      createdAt: 'createAt',
      updatedAt: 'updateAt',
      defaultScope: {
        where: { deleted: 0, status: 1 },
      },
      scopes: {
        userInfo: {
          attributes: { exclude: ['username', 'password', 'createAt', 'updateAt', 'status', 'deleted'] },
        },
      },
    },
  );

  app.logger.info('model DataUser loaded');

  return class DataUser extends DataUserModel {};
}
