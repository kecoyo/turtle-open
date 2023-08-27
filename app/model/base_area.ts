import { Application } from 'egg';
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class BaseAreaModel extends Model<InferAttributes<BaseAreaModel>, InferCreationAttributes<BaseAreaModel>> {
  declare id: number; // ID
  declare name: string; // 区域名称
  declare level: number; // 区域层级
  declare pid: number; // 上级PID
}

export default function (app: Application) {
  const BaseAreaModel = app.model.define<BaseAreaModel>(
    'BaseArea',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      level: DataTypes.TINYINT,
      pid: DataTypes.INTEGER,
    },
    {
      tableName: 'base_area',
    },
  );

  app.logger.info('model BaseArea loaded');

  return class BaseArea extends BaseAreaModel {};
}
