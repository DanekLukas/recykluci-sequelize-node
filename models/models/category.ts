import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { data, dataId } from './data';

export interface categoryAttributes {
  id: number;
  name: string;
  safename: string;
  sort: number;
}

export type categoryPk = "id";
export type categoryId = category[categoryPk];
export type categoryOptionalAttributes = "id" | "safename";
export type categoryCreationAttributes = Optional<categoryAttributes, categoryOptionalAttributes>;

export class category extends Model<categoryAttributes, categoryCreationAttributes> implements categoryAttributes {
  id!: number;
  name!: string;
  safename!: string;
  sort!: number;

  // category hasMany data via category_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof category {
    return sequelize.define('category', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: "name_2"
    },
    safename: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: ""
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'category',
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
        name: "name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "name_2",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  }) as typeof category;
  }
}
