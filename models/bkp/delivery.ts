import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface deliveryAttributes {
  id: number;
  name: string;
  type: number;
  valid_from?: Date;
  valid_to?: Date;
  price: number;
  cod: number;
  inc: number;
  size_id?: number;
}

export type deliveryPk = "id";
export type deliveryId = delivery[deliveryPk];
export type deliveryOptionalAttributes = "id" | "valid_from" | "valid_to" | "cod" | "inc" | "size_id";
export type deliveryCreationAttributes = Optional<deliveryAttributes, deliveryOptionalAttributes>;

export class delivery extends Model<deliveryAttributes, deliveryCreationAttributes> implements deliveryAttributes {
  id!: number;
  name!: string;
  type!: number;
  valid_from?: Date;
  valid_to?: Date;
  price!: number;
  cod!: number;
  inc!: number;
  size_id?: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof delivery {
    return sequelize.define('delivery', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    valid_from: {
      type: DataTypes.DATE,
      allowNull: true
    },
    valid_to: {
      type: DataTypes.DATE,
      allowNull: true
    },
    price: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false
    },
    cod: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    inc: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    size_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    }
  }, {
    tableName: 'delivery',
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
  }) as typeof delivery;
  }
}
