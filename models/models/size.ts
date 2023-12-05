import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { data, dataId } from './data';
import type { delivery, deliveryId } from './delivery';

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

  // size hasMany data via size_id
  data!: data[];
  getData!: Sequelize.HasManyGetAssociationsMixin<data>;
  setData!: Sequelize.HasManySetAssociationsMixin<data, dataId>;
  addDatum!: Sequelize.HasManyAddAssociationMixin<data, dataId>;
  addData!: Sequelize.HasManyAddAssociationsMixin<data, dataId>;
  createDatum!: Sequelize.HasManyCreateAssociationMixin<data>;
  removeDatum!: Sequelize.HasManyRemoveAssociationMixin<data, dataId>;
  removeData!: Sequelize.HasManyRemoveAssociationsMixin<data, dataId>;
  hasDatum!: Sequelize.HasManyHasAssociationMixin<data, dataId>;
  hasData!: Sequelize.HasManyHasAssociationsMixin<data, dataId>;
  countData!: Sequelize.HasManyCountAssociationsMixin;
  // size hasMany delivery via size_id
  deliveries!: delivery[];
  getDeliveries!: Sequelize.HasManyGetAssociationsMixin<delivery>;
  setDeliveries!: Sequelize.HasManySetAssociationsMixin<delivery, deliveryId>;
  addDelivery!: Sequelize.HasManyAddAssociationMixin<delivery, deliveryId>;
  addDeliveries!: Sequelize.HasManyAddAssociationsMixin<delivery, deliveryId>;
  createDelivery!: Sequelize.HasManyCreateAssociationMixin<delivery>;
  removeDelivery!: Sequelize.HasManyRemoveAssociationMixin<delivery, deliveryId>;
  removeDeliveries!: Sequelize.HasManyRemoveAssociationsMixin<delivery, deliveryId>;
  hasDelivery!: Sequelize.HasManyHasAssociationMixin<delivery, deliveryId>;
  hasDeliveries!: Sequelize.HasManyHasAssociationsMixin<delivery, deliveryId>;
  countDeliveries!: Sequelize.HasManyCountAssociationsMixin;

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
