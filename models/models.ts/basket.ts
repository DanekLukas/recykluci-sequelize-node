import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

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
      allowNull: false
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
    ]
  }) as typeof basket;
  }
}
