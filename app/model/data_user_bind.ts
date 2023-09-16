import { Application } from 'egg';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class DataUserBindModel extends Model<InferAttributes<DataUserBindModel>, InferCreationAttributes<DataUserBindModel>> {
  declare id: CreationOptional<number>;
  declare appId: number;
  declare userId: number;
  declare openid: string;
  declare unionid: CreationOptional<string>;
  declare createAt: CreationOptional<Date>;
  declare updateAt: CreationOptional<Date>;
  declare status: CreationOptional<number>;
  declare deleted: CreationOptional<number>;
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
      status: DataTypes.TINYINT,
      deleted: DataTypes.TINYINT,
    },
    {
      tableName: 'data_user_bind',
      createdAt: 'createAt',
      updatedAt: 'updateAt',
      defaultScope: {
        where: { deleted: 0, status: 1 },
      },
    },
  );

  app.logger.info('model UserBind loaded');

  return class UserBind extends DataUserBindModel {};
}
