import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface sellsAttributes {
  id: number;
  user_id?: number;
  date: Date;
  vs?: number;
  delivery_id: number;
  delivery_price: number;
  price: number;
  done: number;
}

export type sellsPk = "id";
export type sellsId = sells[sellsPk];
export type sellsOptionalAttributes = "id" | "user_id" | "date" | "vs" | "delivery_price" | "price" | "done";
export type sellsCreationAttributes = Optional<sellsAttributes, sellsOptionalAttributes>;

export class sells extends Model<sellsAttributes, sellsCreationAttributes> implements sellsAttributes {
  id!: number;
  user_id?: number;
  date!: Date;
  vs?: number;
  delivery_id!: number;
  delivery_price!: number;
  price!: number;
  done!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof sells {
    return sequelize.define('sells', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    vs: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    delivery_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    delivery_price: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    price: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'sells',
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
        name: "fk_user",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  }) as typeof sells;
  }
}
