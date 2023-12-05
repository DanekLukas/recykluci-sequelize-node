import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { delivery, deliveryId } from './delivery';
import type { sells_item, sells_itemId } from './sells_item';

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

  // sells belongsTo delivery via delivery_id
  delivery!: delivery;
  getDelivery!: Sequelize.BelongsToGetAssociationMixin<delivery>;
  setDelivery!: Sequelize.BelongsToSetAssociationMixin<delivery, deliveryId>;
  createDelivery!: Sequelize.BelongsToCreateAssociationMixin<delivery>;
  // sells hasMany sells_item via sells_id
  sells_items!: sells_item[];
  getSells_items!: Sequelize.HasManyGetAssociationsMixin<sells_item>;
  setSells_items!: Sequelize.HasManySetAssociationsMixin<sells_item, sells_itemId>;
  addSells_item!: Sequelize.HasManyAddAssociationMixin<sells_item, sells_itemId>;
  addSells_items!: Sequelize.HasManyAddAssociationsMixin<sells_item, sells_itemId>;
  createSells_item!: Sequelize.HasManyCreateAssociationMixin<sells_item>;
  removeSells_item!: Sequelize.HasManyRemoveAssociationMixin<sells_item, sells_itemId>;
  removeSells_items!: Sequelize.HasManyRemoveAssociationsMixin<sells_item, sells_itemId>;
  hasSells_item!: Sequelize.HasManyHasAssociationMixin<sells_item, sells_itemId>;
  hasSells_items!: Sequelize.HasManyHasAssociationsMixin<sells_item, sells_itemId>;
  countSells_items!: Sequelize.HasManyCountAssociationsMixin;

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
      allowNull: false,
      references: {
        model: 'delivery',
        key: 'id'
      }
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
      {
        name: "fk_delivery",
        using: "BTREE",
        fields: [
          { name: "delivery_id" },
        ]
      },
    ]
  }) as typeof sells;
  }
}
