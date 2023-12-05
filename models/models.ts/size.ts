import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface sizeAttributes {
  id: number;
  name: string;
}

export type sizePk = "id";
export type sizeId = size[sizePk];
export type sizeOptionalAttributes = "id";
export type sizeCreationAttributes = Optional<sizeAttributes, sizeOptionalAttributes>;

export class size extends Model<sizeAttributes, sizeCreationAttributes> implements sizeAttributes {
  id!: number;
  name!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof size {
    return sequelize.define('size', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false
    }
  }, {
    tableName: 'size',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  }) as typeof size;
  }
}
