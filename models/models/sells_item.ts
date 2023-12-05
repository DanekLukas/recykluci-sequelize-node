import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { data, dataId } from './data';
import type { sells, sellsId } from './sells';

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

  // sells_item belongsTo data via data_id
  datum!: data;
  getDatum!: Sequelize.BelongsToGetAssociationMixin<data>;
  setDatum!: Sequelize.BelongsToSetAssociationMixin<data, dataId>;
  createDatum!: Sequelize.BelongsToCreateAssociationMixin<data>;
  // sells_item belongsTo sells via sells_id
  sell!: sells;
  getSell!: Sequelize.BelongsToGetAssociationMixin<sells>;
  setSell!: Sequelize.BelongsToSetAssociationMixin<sells, sellsId>;
  createSell!: Sequelize.BelongsToCreateAssociationMixin<sells>;

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
      allowNull: false,
      references: {
        model: 'data',
        key: 'id'
      }
    },
    sells_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'sells',
        key: 'id'
      }
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
      {
        name: "fk_sells_item_data",
        using: "BTREE",
        fields: [
          { name: "data_id" },
        ]
      },
      {
        name: "fk_sells_item_sells",
        using: "BTREE",
        fields: [
          { name: "sells_id" },
        ]
      },
    ]
  }) as typeof sells_item;
  }
}
