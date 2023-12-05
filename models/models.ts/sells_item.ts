import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface sells_itemAttributes {
  id: number;
  data_id: number;
  sells_id?: number;
}

export type sells_itemPk = "id";
export type sells_itemId = sells_item[sells_itemPk];
export type sells_itemOptionalAttributes = "id" | "sells_id";
export type sells_itemCreationAttributes = Optional<sells_itemAttributes, sells_itemOptionalAttributes>;

export class sells_item extends Model<sells_itemAttributes, sells_itemCreationAttributes> implements sells_itemAttributes {
  id!: number;
  data_id!: number;
  sells_id?: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof sells_item {
    return sequelize.define('sells_item', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    data_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    sells_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    }
  }, {
    tableName: 'sells_item',
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
  }) as typeof sells_item;
  }
}
