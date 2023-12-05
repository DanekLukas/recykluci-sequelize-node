import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { data, dataId } from './data';

export interface basketAttributes {
  id: number;
  date: Date;
  data_id: number;
  session_id?: string;
}

export type basketPk = "id";
export type basketId = basket[basketPk];
export type basketOptionalAttributes = "id" | "date" | "session_id";
export type basketCreationAttributes = Optional<basketAttributes, basketOptionalAttributes>;

export class basket extends Model<basketAttributes, basketCreationAttributes> implements basketAttributes {
  id!: number;
  date!: Date;
  data_id!: number;
  session_id?: string;

  // basket belongsTo data via data_id
  datum!: data;
  getDatum!: Sequelize.BelongsToGetAssociationMixin<data>;
  setDatum!: Sequelize.BelongsToSetAssociationMixin<data, dataId>;
  createDatum!: Sequelize.BelongsToCreateAssociationMixin<data>;

  static initModel(sequelize: Sequelize.Sequelize): typeof basket {
    return sequelize.define('basket', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    data_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'data',
        key: 'id'
      }
    },
    session_id: {
      type: DataTypes.STRING(32),
      allowNull: true
    }
  }, {
    tableName: 'basket',
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
        name: "fk_basket",
        using: "BTREE",
        fields: [
          { name: "data_id" },
        ]
      },
    ]
  }) as typeof basket;
  }
}
