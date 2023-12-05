import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { data, dataId } from './data';

export interface homepageAttributes {
  id: number;
  data_id?: number;
  sort?: number;
}

export type homepagePk = "id";
export type homepageId = homepage[homepagePk];
export type homepageOptionalAttributes = "id" | "data_id" | "sort";
export type homepageCreationAttributes = Optional<homepageAttributes, homepageOptionalAttributes>;

export class homepage extends Model<homepageAttributes, homepageCreationAttributes> implements homepageAttributes {
  id!: number;
  data_id?: number;
  sort?: number;

  // homepage belongsTo data via data_id
  datum!: data;
  getDatum!: Sequelize.BelongsToGetAssociationMixin<data>;
  setDatum!: Sequelize.BelongsToSetAssociationMixin<data, dataId>;
  createDatum!: Sequelize.BelongsToCreateAssociationMixin<data>;

  static initModel(sequelize: Sequelize.Sequelize): typeof homepage {
    return sequelize.define('homepage', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    data_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'data',
        key: 'id'
      }
    },
    sort: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    }
  }, {
    tableName: 'homepage',
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
        name: "fk_data",
        using: "BTREE",
        fields: [
          { name: "data_id" },
        ]
      },
    ]
  }) as typeof homepage;
  }
}
